import { useState } from 'react'
import Card from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import Select from '../../components/UI/Select'

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'QuickGig',
    siteEmail: 'admin@quickgig.test',
    maintenanceMode: false,
    allowRegistrations: true,
    defaultRole: 'student',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSave = () => {
    // In real app, save to backend
    alert('Settings saved!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage platform configuration and preferences
        </p>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          General Settings
        </h2>
        <div className="space-y-4">
          <Input
            label="Site Name"
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
          />
          <Input
            label="Site Email"
            name="siteEmail"
            type="email"
            value={settings.siteEmail}
            onChange={handleChange}
          />
          <Select
            label="Default User Role"
            name="defaultRole"
            value={settings.defaultRole}
            onChange={handleChange}
            options={[
              { value: 'student', label: 'Student' },
              { value: 'client', label: 'Client' },
              { value: 'admin', label: 'Administrator' },
            ]}
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Platform Settings
        </h2>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Maintenance Mode</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="allowRegistrations"
              checked={settings.allowRegistrations}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Allow New Registrations</span>
          </label>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  )
}

