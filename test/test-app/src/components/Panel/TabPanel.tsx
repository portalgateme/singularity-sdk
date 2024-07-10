import React, { useState } from 'react'
import { Box, useTheme, Tabs, Tab, styled } from '@mui/material'


export const StyledMainPanel = styled(Box)(() => {
    return {
        justifyContent: 'center',
    }
})

export const StyledInnerPanel = styled(Box)(() => {
    return {
        display: 'flex',
        flexDirection: 'column',
        width: '695px',
        // minHeight: '465px',
        padding: '16px 24px',
        // alignItems: 'center',
        flexShrink: 0,
        background: '#FFF',
        borderRadius: '8px'
    }
})

export interface TabConfig {
    [key: string]: {
        element: JSX.Element,
        tabTitle: string
    };
}


export interface TabPanelProp {
    tabComponents: TabConfig
    defaultTab: string
}

export const TabPanel: React.FC<TabPanelProp> = ({ tabComponents, defaultTab }) => {
    const theme = useTheme()

    const [tab, setTab] = useState<string>(defaultTab)

    const changeTab = (event: React.SyntheticEvent, tabValue: string) => {
        setTab(tabValue)
    }

    return (
        <StyledInnerPanel>
            <Box width={'100%'} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={tab}
                    onChange={changeTab}
                    textColor={'secondary'}
                    indicatorColor={'primary'}
                    sx={{
                        width: '100%',
                        justifyContent: 'flex-start',
                    }}
                    TabIndicatorProps={{
                        style: {
                            borderBottom: `4px solid ${theme.palette.primary.main}`
                        },
                    }}
                >
                    {Object.entries(tabComponents).map(([value, component]) => (
                        <Tab
                            key={value}
                            sx={{
                                color: theme.palette.text.secondary,
                                textTransform: 'none',
                                typography: 'h4'
                            }}
                            value={value}
                            label={component.tabTitle}
                            disableRipple
                        />
                    ))}
                </Tabs>
            </Box>
            <Box mt={1}>
                {tabComponents[tab].element}
            </Box>
        </StyledInnerPanel>
    )
}
