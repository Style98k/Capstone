import Card from '../../UI/Card'
import Input from '../../UI/Input'
import Select from '../../UI/Select'

export default function GeneralTab({ settings, handleChange }) {
    return (
        <Card className="!shadow-sm !border-gray-200" hover={false}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">General Information</h2>
                <p className="text-sm text-gray-500 mt-1">Basic details about your QuickGig platform.</p>
            </div>

            <div className="space-y-6 max-w-2xl">
                <Input
                    label="Site Name"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    placeholder="e.g. QuickGig"
                />

                <Input
                    label="Site Support Email"
                    name="siteEmail"
                    type="email"
                    value={settings.siteEmail}
                    onChange={handleChange}
                    placeholder="admin@quickgig.com"
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
    )
}
