import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings as SettingsIcon, List, Shield, Monitor, RefreshCw, Save, CheckCircle } from 'lucide-react'

import GeneralTab from '../../components/admin/settings/GeneralTab'
import CategoriesTab from '../../components/admin/settings/CategoriesTab'
import PermissionsTab from '../../components/admin/settings/PermissionsTab'
import PlatformTab from '../../components/admin/settings/PlatformTab'
import UpdatesTab from '../../components/admin/settings/UpdatesTab'
import Button from '../../components/UI/Button'

// Default settings configuration
const DEFAULT_SETTINGS = {
  siteName: 'QuickGig',
  siteDescription: 'Connecting students and local clients for flexible, short-term work.',
  siteEmail: 'admin@quickgig.com',
  contactPhone: '',
  siteLogo: '',
  timezone: 'Asia/Manila',
  facebookUrl: '',
  twitterUrl: '',
  instagramUrl: '',
  categories: [
    { id: '1', name: 'Software Development', count: 12 },
    { id: '2', name: 'Design & Creative', count: 8 },
    { id: '3', name: 'Digital Marketing', count: 5 },
    { id: '4', name: 'Writing & Translation', count: 3 },
  ],
  studentsCanApply: true,
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
    if (saved) {
      // Merge saved settings with defaults to ensure new fields are available
      const parsed = JSON.parse(saved)
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
    return DEFAULT_SETTINGS
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Only save to localStorage when explicitly triggered (not on auto-change)
  // This prevents overwriting during initial load

  const updateSetting = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setHasChanges(true)
  }

  const updateCategories = (newCategories) => {
    setSettings(prev => ({
      ...prev,
      categories: newCategories
    }))
    setHasChanges(true)
  }

  // Save settings to localStorage
  const handleSaveAll = () => {
    setIsSaving(true)
    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem('quickgig_system_settings', JSON.stringify(settings))
      setIsSaving(false)
      setShowSaveSuccess(true)
      setHasChanges(false)
      // Hide success message after 3 seconds
      setTimeout(() => setShowSaveSuccess(false), 3000)
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
    <>
      {/* Success Toast */}
      <AnimatePresence>
        {showSaveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-6 left-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/25"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Settings</h1>
            <p className="text-gray-500 mt-2 text-lg">Manage generic platform configuration and preferences.</p>
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
            className="space-y-6"
          >
            {renderContent()}

            {/* Save Button at bottom of each tab */}
            {activeTab !== 'updates' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-end pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 disabled:opacity-50"
                >
                  <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
