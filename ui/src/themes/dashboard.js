import stylesheet from './dashboard.css.js'

// Modern, premium dashboard theme with smooth gradients and accent colors
export default {
  themeName: 'Dashboard',
  palette: {
    primary: {
      main: '#7C5CFC',
      light: '#9E7CFD',
      dark: '#5A3FD6',
    },
    secondary: {
      main: '#FF6B9D',
      light: '#FF8DB3',
      dark: '#E55583',
    },
    type: 'dark',
    background: {
      default: '#0F0F1A',
      paper: '#1A1A2E',
    },
    text: {
      primary: '#EAEAFF',
      secondary: '#9494B8',
    },
    divider: 'rgba(255,255,255,0.06)',
    action: {
      hover: 'rgba(124,92,252,0.08)',
      selected: 'rgba(124,92,252,0.15)',
    },
    error: {
      main: '#FF4757',
    },
    warning: {
      main: '#FFA502',
    },
    info: {
      main: '#70A1FF',
    },
    success: {
      main: '#2ED573',
    },
  },
  overrides: {
    // ---- Global scrollbar styling ----
    MuiCssBaseline: {
      '@global': {
        '*::-webkit-scrollbar': {
          width: '6px',
        },
        '*::-webkit-scrollbar-track': {
          background: '#0F0F1A',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'rgba(124,92,252,0.3)',
          borderRadius: '3px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(124,92,252,0.5)',
        },
      },
    },

    // ---- Card styling ----
    MuiCard: {
      root: {
        borderRadius: 16,
        backgroundImage: 'none',
      },
    },
    MuiPaper: {
      root: {
        backgroundImage: 'none',
      },
    },

    // ---- Typography ----
    MuiTypography: {
      h6: {
        fontWeight: 600,
        letterSpacing: '0.01em',
      },
      body2: {
        letterSpacing: '0.01em',
      },
    },

    // ---- Buttons ----
    MuiButton: {
      root: {
        borderRadius: 10,
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.01em',
      },
      containedPrimary: {
        background: 'linear-gradient(135deg, #7C5CFC 0%, #5A3FD6 100%)',
        boxShadow: '0 4px 15px rgba(124,92,252,0.3)',
        '&:hover': {
          background: 'linear-gradient(135deg, #9E7CFD 0%, #7C5CFC 100%)',
          boxShadow: '0 6px 20px rgba(124,92,252,0.4)',
        },
      },
      textPrimary: {
        color: '#9E7CFD',
      },
    },

    // ---- IconButtons ----
    MuiIconButton: {
      root: {
        borderRadius: 10,
        '&:hover': {
          backgroundColor: 'rgba(124,92,252,0.1)',
        },
      },
    },

    // ---- AppBar ----
    MuiAppBar: {
      root: {
        backgroundColor: '#1A1A2E !important',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'none',
      },
    },

    // ---- Drawer / Sidebar ----
    MuiDrawer: {
      paper: {
        backgroundColor: '#1A1A2E',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      },
    },

    // ---- Menu Items ----
    MuiMenuItem: {
      root: {
        borderRadius: 8,
        margin: '2px 8px',
        '&.Mui-selected': {
          backgroundColor: 'rgba(124,92,252,0.15)',
          '&:hover': {
            backgroundColor: 'rgba(124,92,252,0.2)',
          },
        },
      },
    },

    // ---- Table ----
    MuiTableRow: {
      root: {
        '&:hover': {
          backgroundColor: 'rgba(124,92,252,0.04) !important',
        },
        '&.Mui-selected': {
          backgroundColor: 'rgba(124,92,252,0.08) !important',
        },
      },
    },

    // ---- Tabs ----
    MuiTabs: {
      indicator: {
        backgroundColor: '#7C5CFC',
        height: 3,
        borderRadius: '3px 3px 0 0',
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.01em',
      },
    },

    // ---- Chips ----
    MuiChip: {
      root: {
        borderRadius: 8,
      },
      outlined: {
        borderColor: 'rgba(124,92,252,0.3)',
      },
    },

    // ---- LinearProgress ----
    MuiLinearProgress: {
      root: {
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.05)',
      },
      bar: {
        borderRadius: 4,
        background: 'linear-gradient(90deg, #7C5CFC, #FF6B9D)',
      },
    },

    // ---- Slider (Player) ----
    MuiSlider: {
      root: {
        color: '#7C5CFC',
      },
      track: {
        height: 4,
        borderRadius: 2,
      },
      rail: {
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
      },
      thumb: {
        width: 14,
        height: 14,
        backgroundColor: '#7C5CFC',
        '&:hover': {
          boxShadow: '0 0 0 8px rgba(124,92,252,0.15)',
        },
      },
    },

    // ---- Login ----
    NDLogin: {
      systemNameLink: {
        color: '#7C5CFC',
      },
      icon: {},
      welcome: {
        color: '#EAEAFF',
      },
      card: {
        minWidth: 300,
        backgroundColor: 'rgba(26,26,46,0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)',
      },
      avatar: {},
      button: {
        background: 'linear-gradient(135deg, #7C5CFC 0%, #5A3FD6 100%)',
        boxShadow: '0 4px 15px rgba(124,92,252,0.3)',
        borderRadius: 10,
      },
    },

    // ---- Album Grid specific ----
    NDAlbumGridView: {
      albumContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.03)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        },
      },
    },
  },
  player: {
    theme: 'dark',
    bg: '#1A1A2E',
    headerBg: '#1A1A2E',
    desktop: {
      bg: '#1A1A2E',
    },
  },
}