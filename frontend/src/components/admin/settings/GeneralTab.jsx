import { useState, useRef, useEffect } from 'react'
import Card from '../../UI/Card'
import Input from '../../UI/Input'
import { Upload, X, Globe, Phone, Facebook, Twitter, Instagram } from 'lucide-react'

export default function GeneralTab({ settings, handleChange }) {
    const fileInputRef = useRef(null)
    const [logoPreview, setLogoPreview] = useState(settings.siteLogo || null)

    // Sync logoPreview when settings.siteLogo changes (e.g., from localStorage)
    useEffect(() => {
        setLogoPreview(settings.siteLogo || null)
    }, [settings.siteLogo])

    const handleLogoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoPreview(reader.result)
                handleChange({
                    target: {
                        name: 'siteLogo',
                        value: reader.result,
                        type: 'text'
                    }
                })
            }
            reader.readAsDataURL(file)
        }
    }

    const removeLogo = () => {
        setLogoPreview(null)
        handleChange({
            target: {
                name: 'siteLogo',
                value: '',
                type: 'text'
            }
        })
    }

    return (
        <Card className="!shadow-sm !border-gray-200" hover={false}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">General Information</h2>
                <p className="text-sm text-gray-500 mt-1">Basic details about your QuickGig platform.</p>
            </div>

            <div className="space-y-6 max-w-2xl">
                {/* Logo Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Logo</label>
                    <div className="flex items-center gap-4">
                        {logoPreview ? (
                            <div className="relative group">
                                <img
                                    src={logoPreview}
                                    alt="Site Logo"
                                    className="w-20 h-20 object-contain rounded-lg border border-gray-200 bg-white p-2"
                                />
                                <button
                                    onClick={removeLogo}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors"
                            >
                                <Upload className="w-6 h-6 text-gray-400" />
                            </div>
                        )}
                        <div className="text-sm text-gray-500">
                            <p>Upload your site logo</p>
                            <p className="text-xs">PNG, JPG up to 2MB</p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                        />
                    </div>
                </div>

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
