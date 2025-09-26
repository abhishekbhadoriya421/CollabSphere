
import { X } from 'lucide-react';
interface SideBarProps {
  isOpen: boolean
  onClose(): void
}
const SettingsSidebar = ({ isOpen, onClose }: SideBarProps) => {
  return (
    <div
      className={`fixed inset-0 bg-opacity-50 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl p-6 
          transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : 'translate-x-full'} // Slide in/out effect
        `}
      >
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-semibold">App Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <ul className="space-y-4">
          <li className="text-gray-700">Organization Management</li>
          <li className="text-gray-700">Notification Preferences</li>
          <li className="text-gray-700">Theme Selector (Light/Dark)</li>
        </ul>

      </div>
    </div>
  );
};

export default SettingsSidebar;