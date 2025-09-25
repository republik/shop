import { buttonRecipe } from "@/theme/src/recipes/button";
import { definePreset } from "@pandacss/dev";

export const presetRepublik = definePreset({
  name: "republik",
  conditions: {
    extend: {
      light: '[data-theme="light"] &',
      dark: '[data-theme="dark"] &',
      stateOpen: '&[data-state="open"]',
      stateClosed: '&[data-state="closed"]',
    },
  },
  globalCss: {
    html: {
      WebkitFontSmoothing: "auto",
      MozOsxFontSmoothing: "auto",
    },
    "strong,b": {
      fontWeight: "medium",
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
          slideUp: { value: "slideUp 300ms ease-in-out" },
          slideDown: { value: "slideDown 300ms ease-in-out" },
          fadeIn: { value: "fadeIn 300ms ease-in-out" },
          fadeOut: { value: "fadeOut 300ms ease-in-out" },
          slideIn: { value: "slideIn 300ms ease-in-out" },
          slideOut: { value: "slideOut 300ms ease-in-out" },
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
            secondary: {
              value: {
                base: "rgba(0,0,0,0.55)",
                _dark: "#rgba(255,255,255,0.55)",
              },
            },
            tertiary: {
              value: {
                base: "rgba(0,0,0,0.45)",
                _dark: "#rgba(255,255,255,0.45)",
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
            DEFAULT: {
              value: {
                base: "white",
                _dark: "#191919",
              },
            },
            light: {
              value: {
                base: "#F1F1F1",
                _dark: "#191919",
              },
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
              base: "rgba(0,0,0,0.25)",
              _dark: "rgba(255,255,255,0.25)",
            },
          },
          disabled: {
            value: {
              base: "rgba(0,0,0,0.03)",
              _dark: "rgba(255,255,255,0.03)",
            },
          },
        },
        sizes: {
          content: { narrow: { value: "30rem" }, wide: { value: "54rem" } },
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
          "2-4": { value: { base: "0.5rem", md: "1rem" } },
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
        fontSizes: {},
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
            fontSize: { base: "lg", md: "xl" },
            lineHeight: 1.375,
          },
        },
        teaserLeadSans: {
          value: {
            fontFamily: "gtAmericaStandard",
            fontWeight: "regular",
            fontStyle: "normal",
            fontSize: { base: "lg", md: "xl" },
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
        leadBold: {
          value: {
            fontFamily: "gtAmericaStandard",
            fontWeight: "medium",
            fontStyle: "normal",
            fontSize: { base: "xl", md: "2xl" },
            lineHeight: 1.4,
          },
        },
        lead: {
          value: {
            fontFamily: "gtAmericaStandard",
            fontWeight: "regular",
            fontStyle: "normal",
            fontSize: { base: "xl", md: "2xl" },
            lineHeight: 1.4,
          },
        },
        leadSerif: {
          value: {
            fontFamily: "rubis",
            fontWeight: "regular",
            fontStyle: "normal",
            fontSize: { base: "xl", md: "2xl" },
            lineHeight: 1.4,
          },
        },
        leadTitleSerif: {
          value: {
            fontFamily: "rubis",
            fontWeight: "medium",
            fontStyle: "normal",
            fontSize: { base: "2xl", md: "3xl" },
            lineHeight: 1.4,
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
      recipes: {
        button: buttonRecipe,
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
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      fadeOut: {
        from: { opacity: 1 },
        to: { opacity: 0 },
      },
      slideUp: {
        from: { transform: "translateY(100%)" },
        to: { transform: "translateY(0%)" },
      },
      slideDown: {
        from: { transform: "translateY(0%)" },
        to: { transform: "translateY(100%)" },
      },
      slideIn: {
        from: { transform: "translateY(5%)" },
        to: { transform: "translateY(0%)" },
      },
      slideOut: {
        from: { transform: "translateY(0%)" },
        to: { transform: "translateY(5%)" },
      },
    },
  },
});
