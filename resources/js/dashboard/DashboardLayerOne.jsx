import WorkingScheduleCard from "@/components/WorkingScheduleCard";
import LatestRegisteredOne from "../components/LatestRegisteredOne";
import TopPerformerOne from "../components/TopPerformerOne";

const DashboardLayerOne = () => {
    return (
        <>
            <section className="row gy-4 mt-1">
                {/* TopPerformerOne */}
                <TopPerformerOne />

                {/* LatestRegisteredOne */}
                <LatestRegisteredOne />

                {/* WorkingScheduleCard */}
                <WorkingScheduleCard />
            </section>
        </>
    );
};

export default DashboardLayerOne;
