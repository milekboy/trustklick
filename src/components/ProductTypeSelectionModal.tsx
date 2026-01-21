'use client'

import { Dialog, DialogContent, DialogTitle, Card, Typography, Button } from '@mui/material'
import { motion } from 'framer-motion'

interface ProductTypeSelectionModalProps {
    open: boolean
    onClose: () => void
    onSelectProductType: (productType: 'thrift' | 'contribution' | 'investment') => void
}

const productTypes = [
    {
        type: 'thrift' as const,
        icon: 'ri-coin-line',
        title: 'Thrift',
        description: 'A rotatory savings where each member shares in different collection period saving the same amount over a period of time. This is the regular Esusu, Ajo.',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600'
    },
    {
        type: 'contribution' as const,
        icon: 'ri-hand-heart-line',
        title: 'Contribution',
        description: 'Usually for like a one off contribution for maybe a members wedding, to support a lost loved one. This is usually non profit.',
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600'
    },
    {
        type: 'investment' as const,
        icon: 'ri-line-chart-line',
        title: 'Investment',
        description: 'This is when members come together to contribute towards a joint business venture. This percentage ownership can be alloted if turned on the klick and cycle dividends can also be shared.',
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600'
    }
]

export default function ProductTypeSelectionModal({
    open,
    onClose,
    onSelectProductType
}: ProductTypeSelectionModalProps) {
    const handleSelect = (type: 'thrift' | 'contribution' | 'investment') => {
        onSelectProductType(type)
        onClose()
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth='lg'
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: 'visible'
                }
            }}
        >
            <DialogTitle>
                <div className='text-center pb-2'>
                    <Typography variant='h4' className='font-bold mb-2'>
                        Choose Cycle Type
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        Select the type of cycle you want to create for your Klick
                    </Typography>
                </div>
            </DialogTitle>
            <DialogContent className='pb-8 pt-4'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {productTypes.map((product, index) => (
                        <motion.div
                            key={product.type}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                className={`p-6 h-full flex flex-col hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-current ${product.bgColor}`}
                                sx={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-8px)'
                                    }
                                }}
                            >
                                {/* Decorative gradient overlay */}
                                <div
                                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${product.color}`}
                                />

                                {/* Icon */}
                                <div className='flex justify-center mb-4'>
                                    <div className={`w-16 h-16 rounded-full ${product.bgColor} flex items-center justify-center`}>
                                        <i className={`${product.icon} text-4xl ${product.iconColor}`} />
                                    </div>
                                </div>

                                {/* Title */}
                                <Typography variant='h5' className='font-bold text-center mb-3'>
                                    {product.title}
                                </Typography>

                                {/* Description */}
                                <Typography
                                    variant='body2'
                                    color='text.secondary'
                                    className='text-center mb-6 flex-1 leading-relaxed'
                                >
                                    {product.description}
                                </Typography>

                                {/* Button */}
                                <Button
                                    variant='contained'
                                    fullWidth
                                    onClick={() => handleSelect(product.type)}
                                    className={`bg-gradient-to-r ${product.color} text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all`}
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        background: `linear-gradient(135deg, ${product.color.includes('blue') ? '#3b82f6, #2563eb' : product.color.includes('green') ? '#10b981, #059669' : '#a855f7, #9333ea'})`
                                    }}
                                >
                                    Proceed with this
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Helper text */}
                <div className='mt-6 text-center'>
                    <Typography variant='caption' color='text.secondary'>
                        Not sure which to choose? You can always create different cycle types later.
                    </Typography>
                </div>
            </DialogContent>
        </Dialog>
    )
}
