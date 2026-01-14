'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiExclamationTriangle,
  HiInformationCircle
} from 'react-icons/hi2'

const toastStyles = {
  success: {
    icon: <HiCheckCircle className="text-success w-6 h-6" />,
    border: 'border-success/30',
    bg: 'bg-success/10',
    bar: 'bg-success'
  },
  error: {
    icon: <HiExclamationCircle className="text-error w-6 h-6" />,
    border: 'border-error/30',
    bg: 'bg-error/10',
    bar: 'bg-error'
  },
  warning: {
    icon: <HiExclamationTriangle className="text-warning w-6 h-6" />,
    border: 'border-warning/30',
    bg: 'bg-warning/10',
    bar: 'bg-warning'
  },
  info: {
    icon: <HiInformationCircle className="text-info w-6 h-6" />,
    border: 'border-info/30',
    bg: 'bg-info/10',
    bar: 'bg-info'
  }
}

export default function Toast({ message, type = 'info', onClose }) {
  const [progress, setProgress] = useState(100)
  const duration = 3000

  useEffect(() => {
    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)

      if (elapsed >= duration) {
        clearInterval(timer)
        onClose()
      }
    }, 10)

    return () => clearInterval(timer)
  }, [onClose, duration])

  const style = toastStyles[type] || toastStyles.info

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`fixed top-6 right-6 min-w-[320px] backdrop-blur-md rounded-xl shadow-2xl z-[9999] overflow-hidden border ${style.bg} ${style.border}`}
    >
      <div className="p-4 flex items-center gap-4">
        <div className="flex-shrink-0">
          {style.icon}
        </div>

        <div className="flex-grow">
          <p className="text-sm font-medium text-textPrimary leading-tight">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 cursor-pointer rounded-lg hover:bg-black/5 transition-colors text-textSecondary hover:text-textPrimary"
        >
          <IoMdClose className="text-xl" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
        <motion.div
          className={`h-full ${style.bar}`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear' }}
        />
      </div>
    </motion.div>
  )
}
