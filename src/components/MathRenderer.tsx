import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

interface MathRendererProps {
  latex: string;
  style?: any;
}

// Convert LaTeX to readable text format
const formatLatexToText = (latex: string): string => {
  let text = latex;

  // Handle fractions: \frac{a}{b} -> (a/b)
  text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)');

  // Handle superscripts: x^{n} -> xⁿ (using Unicode superscripts for common cases)
  const superscripts: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    'n': 'ⁿ', 'x': 'ˣ', 'y': 'ʸ'
  };

  text = text.replace(/\^?\{?(\d+|[nxy])\}?/g, (match, char) => {
    return superscripts[char] || `^${char}`;
  });

  // Handle common functions
  text = text.replace(/\\int/g, '∫');
  text = text.replace(/\\pi/g, 'π');
  text = text.replace(/\\sin/g, 'sin');
  text = text.replace(/\\cos/g, 'cos');
  text = text.replace(/\\tan/g, 'tan');
  text = text.replace(/\\sqrt/g, '√');
  text = text.replace(/\\,/g, ' ');
  text = text.replace(/\\\\/g, '');

  // Clean up remaining LaTeX commands
  text = text.replace(/\\[a-zA-Z]+/g, '');
  text = text.replace(/[{}]/g, '');

  return text.trim();
};

const MathRenderer: React.FC<MathRendererProps> = ({ latex, style }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const formattedText = formatLatexToText(latex);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh;
            background-color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          #math { 
            font-size: 24px;
            color: #0F172A;
            padding: 10px;
          }
          .katex { font-size: 1.3em !important; }
        </style>
      </head>
      <body>
        <div id="math"></div>
        <script>
          try {
            const latex = ${JSON.stringify(latex)};
            katex.render(latex, document.getElementById('math'), {
              throwOnError: false,
              displayMode: true,
              trust: true
            });
            window.ReactNativeWebView.postMessage('success');
          } catch (e) {
            window.ReactNativeWebView.postMessage('error: ' + e.message);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View style={[styles.container, style]}>
      {/* Show formatted text as fallback */}
      {(error || isLoading) && (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackText}>{formattedText}</Text>
        </View>
      )}

      {/* Try to render with WebView */}
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={[styles.webview, (error || isLoading) && styles.hidden]}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          const message = event.nativeEvent.data;
          if (message === 'success') {
            setIsLoading(false);
            setError(null);
          } else if (message.startsWith('error')) {
            setError(message);
            setIsLoading(false);
          }
        }}
        onError={() => {
          setError('WebView failed to load');
          setIsLoading(false);
        }}
        onLoadEnd={() => {
          // Give KaTeX time to render
          setTimeout(() => {
            if (isLoading) {
              setIsLoading(false);
            }
          }, 1000);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 140,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  webview: {
    backgroundColor: 'transparent',
  },
  hidden: {
    opacity: 0,
  },
  fallbackContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  fallbackText: {
    fontSize: 20,
    color: '#0F172A',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});

export default MathRenderer;
