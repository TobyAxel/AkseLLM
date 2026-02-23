import { useUserStore } from "../../../../stores/useUserStore";

function GeneralView() {
    const { profile } = useUserStore();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
                <p className="text-neutral-400 text-sm">General settings</p>
            </div>
            <div className="space-y-3 pt-4 border-t border-neutral-700/50">
                {/* TODO: general settings content */}
            </div>
        </div>
    );
}

export default GeneralView;