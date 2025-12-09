import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings as SettingsIcon, List, Shield, Monitor, RefreshCw, Save } from 'lucide-react'

import GeneralTab from '../../components/admin/settings/GeneralTab'
import CategoriesTab from '../../components/admin/settings/CategoriesTab'
import PermissionsTab from '../../components/admin/settings/PermissionsTab'
import PlatformTab from '../../components/admin/settings/PlatformTab'
import UpdatesTab from '../../components/admin/settings/UpdatesTab'
import Button from '../../components/UI/Button'

// Default settings configuration
const DEFAULT_SETTINGS = {
  siteName: 'QuickGig',
  siteEmail: 'admin@quickgig.com',
  defaultRole: 'student',
  categories: [
    { id: '1', name: 'Software Development', count: 12 },
    { id: '2', name: 'Design & Creative', count: 8 },
    { id: '3', name: 'Digital Marketing', count: 5 },
    { id: '4', name: 'Writing & Translation', count: 3 },
  ],
  studentsCanApply: true,
  clientsCanPost: false,
  adminModeration: true,
  enableReporting: true,
  maintenanceMode: false,
  maintenanceMessage: '',
  allowRegistrations: true,
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('quickgig_system_settings')
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS
  })
  const [isSaving, setIsSaving] = useState(false)

  // Auto-save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('quickgig_system_settings', JSON.stringify(settings))
  }, [settings])

  const updateSetting = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const updateCategories = (newCategories) => {
    setSettings(prev => ({
      ...prev,
      categories: newCategories
    }))
  }

  // Simulate remote save
  const handleSaveAll = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      // Could show a toast here
      // But persistent localStorage means it's already "saved" locally
    }, 800)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'categories', label: 'Categories', icon: List },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'platform', label: 'Platform', icon: Monitor },
    { id: 'updates', label: 'Updates', icon: RefreshCw },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab settings={settings} handleChange={updateSetting} />
      case 'categories':
        return <CategoriesTab categories={settings.categories} onUpdate={updateCategories} />
      case 'permissions':
        return <PermissionsTab settings={settings} handleChange={updateSetting} />
      case 'platform':
        return <PlatformTab settings={settings} handleChange={updateSetting} />
      case 'updates':
        return <UpdatesTab />
      default:
        return <GeneralTab settings={settings} handleChange={updateSetting} />
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Settings</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage generic platform configuration and preferences.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={handleSaveAll} disabled={isSaving}>
            <Save className={`w-4 h-4 mr-2 ${isSaving ? 'animate-pulse' : ''}`} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex space-x-1 overflow-x-auto pb-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10 transition-all rounded-t-lg
                  ${isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}
                `}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  <span>{tab.label}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-primary-600"
                  />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
