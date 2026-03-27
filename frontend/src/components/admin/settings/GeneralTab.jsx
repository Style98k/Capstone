import Card from '../../UI/Card'
import Input from '../../UI/Input'
import { Globe, Phone, Facebook, Twitter, Instagram } from 'lucide-react'

export default function GeneralTab({ settings, handleChange }) {
    return (
        <Card className="!shadow-sm !border-gray-200" hover={false}>
            <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">General Information</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Basic details about your QuickGig platform.</p>
            </div>

            <div className="space-y-4 sm:space-y-6 max-w-2xl">
                <Input
                    label="Site Name"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    placeholder="e.g. QuickGig"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                    <textarea
                        name="siteDescription"
                        value={settings.siteDescription || ''}
                        onChange={handleChange}
                        placeholder="A brief description of your platform..."
                        rows={3}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border"
                    />
                </div>

                <Input
                    label="Site Support Email"
                    name="siteEmail"
                    type="email"
                    value={settings.siteEmail}
                    onChange={handleChange}
                    placeholder="admin@quickgig.com"
                />

                <Input
                    label="Contact Phone"
                    name="contactPhone"
                    type="tel"
                    value={settings.contactPhone || ''}
                    onChange={handleChange}
                    placeholder="+63 912 345 6789"
                    leftIcon={Phone}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                        name="timezone"
                        value={settings.timezone || 'Asia/Manila'}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border"
                    >
                        <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                        <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                        <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                        <option value="America/New_York">America/New York (EST)</option>
                        <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                </div>

                {/* Social Media Links */}
                <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Social Media Links
                    </h3>
                    <div className="space-y-4">
                        <Input
                            label="Facebook Page"
                            name="facebookUrl"
                            value={settings.facebookUrl || ''}
                            onChange={handleChange}
                            placeholder="https://facebook.com/quickgig"
                            leftIcon={Facebook}
                        />
                        <Input
                            label="Twitter/X"
                            name="twitterUrl"
                            value={settings.twitterUrl || ''}
                            onChange={handleChange}
                            placeholder="https://twitter.com/quickgig"
                            leftIcon={Twitter}
                        />
                        <Input
                            label="Instagram"
                            name="instagramUrl"
                            value={settings.instagramUrl || ''}
                            onChange={handleChange}
                            placeholder="https://instagram.com/quickgig"
                            leftIcon={Instagram}
                        />
                    </div>
                </div>
            </div>
        </Card>
    )
}
