import Card from '../../UI/Card'

const Toggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
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

export default function PermissionsTab({ settings, handleChange }) {
    const handleToggle = (key) => (e) => {
        handleChange({
            target: {
                name: key,
                checked: e.target.checked,
                type: 'checkbox'
            }
        })
    }

    return (
        <Card className="!shadow-sm !border-gray-200" hover={false}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Permissions & Access</h2>
                <p className="text-sm text-gray-500 mt-1">Control user capabilities and system features.</p>
            </div>

            <div className="space-y-1">
                <Toggle
                    label="Student Applications"
                    description="Allow students to apply for gigs."
                    checked={settings.studentsCanApply}
                    onChange={handleToggle('studentsCanApply')}
                />
                <Toggle
                    label="Job Post Review"
                    description="New job posts require admin review before going live."
                    checked={settings.adminModeration}
                    onChange={handleToggle('adminModeration')}
                />
                <Toggle
                    label="Reporting System"
                    description="Enable users to report inappropriate content."
                    checked={settings.enableReporting}
                    onChange={handleToggle('enableReporting')}
                />
            </div>
        </Card>
    )
}
