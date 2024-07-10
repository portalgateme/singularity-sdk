
const components = {
    MuiButton: {
        styleOverrides: {
            root: {
                backgroundColor: '#77ED91',
                borderRadius: '9999px',
                '&:hover': {
                    backgroundColor: '#77ED91',
                },
                "&.Mui-disabled": {
                    backgroundColor: "#E8EFEC",
                },
                '&.Mui-size-small': {
                    fontSize: '0.875rem',
                    lineHeight: '114.286%',
                    padding: '6px 8px',
                },
                '&.Mui-size-medium': {
                    fontSize: '1rem',
                    lineHeight: '125%',
                },
                '&.Mui-size-large': {
                    fontSize: '1.125rem',
                    lineHeight: '133.333%',
                },
            },
        },
    },
    MuiInput: {
        styleOverrides: {
            root: {
                '&::placeholder': {
                    color: '#8DB09F',
                },
            },
        },
    },
    MuiTextareaAutosize: {
        styleOverrides: {
            root: {
                '&::placeholder': {
                    color: '#8DB09F',
                },
            },
        },
    },
}

export default components
