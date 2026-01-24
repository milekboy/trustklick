'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { styled, useTheme } from '@mui/material/styles'

// Third-party Imports
import { motion, AnimatePresence } from 'framer-motion'
import { RiMoneyDollarCircleLine, RiUserSmileLine, RiArrowUpLine, RiShieldCheckLine } from 'react-icons/ri'

// Styled Components
const DashboardCard = styled(Card)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    overflow: 'visible',
    position: 'relative'
}))

const FloatingAvatar = styled(motion.div)(({ theme }) => ({
    position: 'absolute',
    zIndex: 2,
    borderRadius: '50%',
    padding: '4px',
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[3]
}))

const HeroDashboard = () => {
    const theme = useTheme()
    const [cycleAmount, setCycleAmount] = useState(48500)

    // Simulation of contributions increasing the pot
    useEffect(() => {
        const interval = setInterval(() => {
            setCycleAmount(prev => prev + Math.floor(Math.random() * 100) + 50)
        }, 2500)
        return () => clearInterval(interval)
    }, [])

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '450px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            {/* Central Pot Card */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <DashboardCard sx={{ width: 280, height: 280, borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                    <Box sx={{ position: 'absolute', inset: -10, borderRadius: '50%', border: `2px dashed ${theme.palette.primary.main}`, opacity: 0.3 }}
                        component={motion.div}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />

                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2, mb: 1 }}>
                        TOTAL POOL
                    </Typography>
                    <Typography variant="h3" color="primary" sx={{ fontWeight: 800, mb: 0.5 }}>
                        ${cycleAmount.toLocaleString()}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main', bgcolor: 'success.light', px: 1, py: 0.5, borderRadius: 1 }}>
                        <RiArrowUpLine size={16} />
                        <Typography variant="caption" fontWeight="bold">+12% this cycle</Typography>
                    </Box>
                    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <RiShieldCheckLine size={20} />
                        <Typography variant="caption">Secured by Trustklick</Typography>
                    </Box>
                </DashboardCard>
            </motion.div>

            {/* Orbiting Members */}
            {[0, 1, 2, 3, 4].map((i) => {
                const radius = 220
                const angle = (i * 72) * (Math.PI / 180)
                // Initial static position for hydration match, then animate
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                return (
                    <FloatingAvatar
                        key={i}
                        initial={{ x, y, scale: 0 }}
                        animate={{
                            x: [x, Math.cos(angle + 0.5) * radius, x],
                            y: [y, Math.sin(angle + 0.5) * radius, y],
                            scale: 1
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: i * 0.2
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 50,
                                height: 50,
                                bgcolor: theme.palette.primary.light,
                                color: theme.palette.primary.contrastText
                            }}
                        >
                            <RiUserSmileLine size={28} />
                        </Avatar>

                        {/* Payment Particles */}
                        <AnimatePresence>
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    background: theme.palette.success.main,
                                    zIndex: -1
                                }}
                                initial={{ x: 0, y: 0, opacity: 0 }}
                                animate={{
                                    x: -x * 0.8, // Move towards center (approx)
                                    y: -y * 0.8,
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: Math.random() * 5,
                                    ease: "easeInOut"
                                }}
                            />
                        </AnimatePresence>
                    </FloatingAvatar>
                )
            })}

            {/* Decorative localized ambient glows */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '120%',
                    height: '120%',
                    background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
                    zIndex: 0,
                    pointerEvents: 'none'
                }}
            />

        </Box>
    )
}

export default HeroDashboard
