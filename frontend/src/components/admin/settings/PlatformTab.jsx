import Card from '../../UI/Card'

const Toggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-4">
        <div className="pr-4">
            <h3 className="text-sm font-medium text-gray-900">{label}</h3>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={onChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
    </div>
)

export default function PlatformTab({ settings, handleChange }) {
    const handleToggle = (key) => (e) => {
        handleChange({
            target: {
                name: key,
                value: e.target.checked,
                type: 'checkbox'
            }
        })
    }

    return (
        <Card className="!shadow-sm !border-gray-200" hover={false}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Platform Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Manage system availability and registration access.</p>
            </div>

            <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                    <Toggle
                        label="Maintenance Mode"
                        description="Disable access for non-admin users."
                        checked={settings.maintenanceMode}
                        onChange={handleToggle('maintenanceMode')}
                    />

                    {settings.maintenanceMode && (
                        <div className="mt-4 pl-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Message</label>
                            <textarea
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border"
                                rows={3}
                                name="maintenanceMessage"
                                value={settings.maintenanceMessage}
                                onChange={handleChange}
                                placeholder="We are currently performing scheduled maintenance..."
                            />
                        </div>
                    )}
                </div>

                <div>
                    <Toggle
                        label="Allow New Registrations"
                        description="If disabled, potential users cannot sign up."
                        checked={settings.allowRegistrations}
                        onChange={handleToggle('allowRegistrations')}
                    />
                </div>
            </div>
        </Card>
    )
}
