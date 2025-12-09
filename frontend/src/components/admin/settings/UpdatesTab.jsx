import { useState } from 'react'
import Card from '../../UI/Card'
import Button from '../../UI/Button'
import { RefreshCw, CheckCircle } from 'lucide-react'

export default function UpdatesTab() {
    const [checking, setChecking] = useState(false)
    const [upToDate, setUpToDate] = useState(false)

    const handleCheck = () => {
        setChecking(true)
        setUpToDate(false)
        setTimeout(() => {
            setChecking(false)
            setUpToDate(true)
            setTimeout(() => setUpToDate(false), 3000)
        }, 2000)
    }

    return (
        <Card className="!shadow-sm !border-gray-200" hover={false}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">System Updates</h2>
                <p className="text-sm text-gray-500 mt-1">Check for the latest version of QuickGig.</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Current Version</p>
                    <div className="flex items-center mt-1">
                        <span className="text-2xl font-bold text-gray-900">v2.4.0</span>
                        <span className="ml-3 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Stable
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <Button onClick={handleCheck} disabled={checking}>
                        {checking ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Checking...
                            </>
                        ) : (
                            'Check for Updates'
                        )}
                    </Button>
                    {upToDate && (
                        <div className="mt-2 flex items-center text-sm text-green-600 animate-fade-in">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            System is up to date
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Changelog</h3>
                <ul className="space-y-3">
                    <li className="flex items-start">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 mr-3"></span>
                        <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">v2.4.0</span> - Added comprehensive system settings and category management.</p>
                    </li>
                    <li className="flex items-start">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 mr-3"></span>
                        <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">v2.3.5</span> - Improved dashboard performance and UI animations.</p>
                    </li>
                </ul>
            </div>
        </Card>
    )
}
