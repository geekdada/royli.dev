import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

export default function NellyIcon() {
  const control = useAnimation()

  useEffect(() => {
    control.start({
      pathLength: [0, 1, 1, 1, 1],
      pathOffset: [0, 0, 0, 1],
      transition: {
        duration: 4,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 1,
      },
    })

    return () => {
      control.stop()
    }
  }, [control])

  return (
    <motion.svg viewBox="0 0 86 35" fill="currentColor">
      <motion.path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.4004 33.5998C41.8004 33.6 46.8004 31.7 50.5004 26C54.2004 20.3 55.3004 13 55.3004 9.69981C55.3004 6.39961 54.5004 0.799911 51.0004 0.799805C47.5004 0.799699 45.4088 8.72316 46.6004 17.6998C48.1004 29 51.9991 33.5999 56.0004 33.5999C62.2017 33.5999 65.4524 25.9035 65.9004 18.9999C66.149 15.1692 65.1004 10.0998 62.1004 10.0999C59.6004 10.1 57.5004 15 58.9004 21.1999C61.0606 30.7665 67.1004 33.5999 72.4004 33.5999"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        animate={control}
        strokeDasharray="0 1"
      ></motion.path>
      <path
        d="M77.7726 29.1225V21.5679L86 5.61855H80.2143L75.1641 17.1355L70.1131 5.61855H64.3274L72.5548 21.6346V29.1225H77.7726Z"
        fill="currentColor"
      ></path>
      <path
        d="M22.9238 5.75176V29.1007H14.087L4.98127 8.05299V29.1007H0V5.75176H8.80025L17.9417 26.8662V5.75176H22.9238Z"
        fill="currentColor"
      ></path>
      <path
        d="M43.6787 29.0933V24.6983L31.086 24.695V19.3608H41.9834V14.9967H31.086V10.1267H43.4454V5.75596H25.8681V29.0933H43.6787Z"
        fill="currentColor"
      ></path>
    </motion.svg>
  )
}
