import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface SidebarWidgetProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultCollapsed?: boolean
  className?: string
}

export function SidebarWidget({ 
  title, 
  icon, 
  children, 
  defaultCollapsed = false,
  className = ''
}: SidebarWidgetProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  return (
    <div className={`mb-6 rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-sm overflow-hidden ${className}`}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 m-0">
          {icon} {title}
        </h3>
        <button 
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
      
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4 pt-0 mt-4 border-t border-border/50">
              <div className="pt-4">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
