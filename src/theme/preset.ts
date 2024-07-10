import { definePreset } from "@pandacss/dev";

export const presetRepublik = definePreset({
  conditions: {
    extend: {
      light: '[data-theme="light"] &',
      dark: '[data-theme="dark"] &',
    },
  },
  globalCss: {
    html: {
      WebkitFontSmoothing: "auto",
      MozOsxFontSmoothing: "auto",
    },
  },
  patterns: {
    extend: {
      container: {
        defaultValues: {},
        transform(props) {
          return {
            w: "full",
            maxWidth: "4xl",
            mx: "auto",
            ...props,
          };
        },
      },
    },
  },
  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        fonts: {
          republikSerif: {
            value: "RepublikSerif, Georgia, serif",
          },
          rubis: {
            value: "Rubis, Georgia, Droid-Serif, serif",
          },
          gtAmericaStandard: {
            value:
              "GT-America-Standard, Helvetica-Neue, Arial, Roboto, sans-serif",
          },
          inicia: {
            value: "Inicia-Medium, Helvetica-Neue, Arial, Roboto, sans-serif",
          },
          druk: {
            value: "Druk, Helvetica-Neue, Arial, Roboto, sans-serif",
          },
        },
        lineHeights: {
          1: { value: 1 },
        },
        animations: {
          spin: { value: "spin 1s linear infinite" },
        },
      },
      semanticTokens: {
        colors: {
          text: {
            DEFAULT: {
              value: {
                base: "{colors.neutral.950}",
                _dark: "{colors.neutral.50}",
              },
            },
            inverted: {
              value: {
                base: "{colors.neutral.50}",
                _dark: "{colors.neutral.950}",
              },
            },
            white: {
              value: "{colors.neutral.50}",
            },
            black: {
              value: "{colors.neutral.950}",
            },
            primaryForeground: {
              value: "white",
            },
          },
          contrast: {
            value: {
              base: "black",
              _dark: "white",
            },
          },
          background: {
            value: {
              base: "white",
              _dark: "#191919",
            },
          },
          pageBackground: {
            value: {
              base: "white",
              _dark: "#191919",
            },
          },
          link: {
            value: {
              base: "#00AA00",
              _dark: "#00AA00",
            },
          },
          primary: {
            value: {
              base: "#000000",
              _dark: "#00AA00",
            },
          },
          primaryHover: {
            value: {
              base: "#242424",
              _dark: "#008800",
            },
          },
          overlay: {
            value: { base: "rgba(0,0,0,0.2)", _dark: "rgba(0,0,0,0.4)" },
          },
          error: {
            value: { base: "#dc2626", _dark: "#dc2626" },
          },
          divider: {
            value: {
              base: "#DBDCDD",
              _dark: "#4C4C4C",
            },
          },
          disabled: {
            value: {
              base: "#B8BDC1",
              _dark: "#949494",
            },
          },
          textSoft: {
            value: {
              base: "#757575",
              _dark: "#A9A9A9",
            },
          },
        },
        sizes: {
          maxContentWidth: { value: "52rem" },
          header: {
            height: { value: { base: "48px", md: "60px" } },
            avatar: { value: { base: "26px", md: "32px" } },
            logoHeight: { value: { base: "23px", md: "28px" } },
          },
        },

        lineHeights: {
          pageNav: { value: "2.5rem" },
        },
        spacing: {
          "4-8": { value: { base: "1rem", md: "2rem" } },
          "8-16": { value: { base: "2rem", md: "4rem" } },
          "16-32": { value: { base: "4rem", md: "8rem" } },
          "32-64": { value: { base: "8rem", md: "16rem" } },
          header: {
            height: { value: "{sizes.header.height}" },
            avatarMargin: { value: "0.6875rem  1rem" },
            logoMargin: { value: { base: "12px 0", md: "15px 0" } },
          },
        },
        fontSizes: {
          "l-xl": {
            value: {
              base: "{fontSizes.l}",
              md: "{fontSizes.xl}",
            },
          },
        },
      },

      textStyles: {
        body: {
          description: "Body text",
          value: {
            fontFamily: "gtAmericaStandard",
          },
        },
        title: {
          value: {
            fontFamily: "republikSerif",
            fontWeight: "black",
            fontStyle: "normal",
            fontSize: "4em",
          },
        },
        teaserTitle: {
          value: {
            fontFamily: "republikSerif",
            fontWeight: "black",
            fontStyle: "normal",
            fontSize: { base: "3xl", md: "3rem" },
            lineHeight: 1.125,
          },
        },
        teaserLead: {
          value: {
            fontFamily: "rubis",
            fontWeight: "regular",
            fontStyle: "normal",
            fontSize: { base: "l", md: "xl" },
            lineHeight: 1.375,
          },
        },
        teaserLeadSans: {
          value: {
            fontFamily: "gtAmericaStandard",
            fontWeight: "regular",
            fontStyle: "normal",
            fontSize: { base: "l", md: "xl" },
            lineHeight: 1.375,
          },
        },
        teaserCredits: {
          value: {
            fontFamily: "gtAmericaStandard",
            fontWeight: "regular",
            fontStyle: "normal",
            fontSize: "s",
            lineHeight: 1.375,
          },
        },
        sans: {
          value: {
            fontFamily: "gtAmericaStandard",
            fontWeight: "regular",
            fontStyle: "normal",
            fontSize: "responsiveText",
            lineHeight: 1.5,
          },
        },
        serif: {
          value: {
            fontFamily: "rubis",
            fontWeight: "regular",
            fontStyle: "normal",
            fontSize: "responsiveText",
            lineHeight: 1.5,
          },
        },
        h1Sans: {
          value: {
            fontFamily: "gtAmericaStandard",
            fontWeight: "medium",
            fontStyle: "normal",
            fontSize: "3xl",
            lineHeight: 1.16667,
          },
        },
        h2Sans: {
          value: {
            fontFamily: "gtAmericaStandard",
            fontWeight: "medium",
            fontStyle: "normal",
            fontSize: "2xl",
            lineHeight: 1.16667,
          },
        },
        h3Sans: {
          value: {
            fontFamily: "gtAmericaStandard",
            fontWeight: "medium",
            fontStyle: "normal",
            fontSize: "xl",
            lineHeight: 1.16667,
          },
        },
        h1Serif: {
          value: {
            fontFamily: "rubis",
            fontWeight: "bold",
            fontStyle: "normal",
            fontSize: "3xl",
            lineHeight: 1.16667,
          },
        },
        h2Serif: {
          value: {
            fontFamily: "rubis",
            fontWeight: "bold",
            fontStyle: "normal",
            fontSize: "2xl",
            lineHeight: 1.16667,
          },
        },
        h3Serif: {
          value: {
            fontFamily: "rubis",
            fontWeight: "bold",
            fontStyle: "normal",
            fontSize: "xl",
            lineHeight: 1.16667,
          },
        },

        // LEGACY
        serifTitle: {
          value: {
            fontFamily: "republikSerif",
            fontWeight: 900,
            fontStyle: "normal",
          },
        },
        serifRegular: {
          value: {
            fontFamily: "rubis",
            fontWeight: 400,
            fontStyle: "normal",
          },
        },
        serifItalic: {
          value: {
            fontFamily: "rubis",
            fontWeight: 400,
            fontStyle: "italic",
          },
        },
        serifBold: {
          value: {
            fontFamily: "rubis",
            fontWeight: 700,
            fontStyle: "normal",
          },
        },
        serifBoldItalic: {
          value: {
            fontFamily: "rubis",
            fontWeight: 700,
            fontStyle: "italic",
          },
        },
        sansSerifRegular: {
          value: {
            fontFamily: "gtAmericaStandard",
            fontWeight: 400,
            fontStyle: "normal",
          },
        },
        sansSerifItalic: {
          value: {
            fontFamily: "gtAmericaStandard",
            fontWeight: 400,
            fontStyle: "italic",
          },
        },
        sansSerifMedium: {
          value: {
            fontFamily: "gtAmericaStandard",
            fontWeight: 500,
            fontStyle: "normal",
          },
        },
        sansSerifBold: {
          value: {
            fontFamily: "gtAmericaStandard",
            fontWeight: 700,
            fontStyle: "normal",
          },
        },
        monospaceRegular: {
          value: {
            fontFamily: "Menlo, Courier, monospace",
            fontWeight: 400,
            fontStyle: "normal",
          },
        },
        cursiveTitle: {
          value: {
            fontFamily: "inicia",
            fontWeight: 500,
            fontStyle: "italic",
          },
        },
        flyerTitle: {
          value: {
            fontFamily: "Druk-Wide, Roboto, sans-serif",
            fontWeight: 500,
            fontStyle: "normal",
          },
        },
      },
    },
    keyframes: {
      radixCollapsibleSlideDown: {
        from: { height: 0 },
        to: { height: "var(--radix-collapsible-content-height)" },
      },
      radixCollapsibleSlideUp: {
        from: { height: "var(--radix-collapsible-content-height)" },
        to: { height: 0 },
      },
      progressGrow: {
        from: { width: 0 },
        to: { width: "var(--progress-width)" },
      },
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    },
  },
});
