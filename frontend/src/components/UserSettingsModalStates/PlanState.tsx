import type { Profile } from "../../domain/profile";

type PlanStateProps = {
    userprofile: Profile | null;
};

function PlanState({ userprofile }: PlanStateProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Plan & Billing</h3>
                <p className="text-neutral-400 text-sm">Plan settings</p>
            </div>
        </div>
    );
}

export default PlanState;