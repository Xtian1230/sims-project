// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../../../Firebase/firebaseConfig.js"; // Adjust as needed
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import BgImage from "../../../assets/BgImage.jpg";

const BgStyle = {
    backgroundImage: `url(${BgImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
};

const WeeklyReport = () => {
    const { location } = useParams();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedReport, setExpandedReport] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const q = query(
                    collection(db, "weeklyReports"),
                    where("branch", "==", location)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const fetchedReports = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setReports(fetchedReports);
                } else {
                    setReports([]);
                }
            } catch (error) {
                console.error("Error fetching weekly reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [location]);

    const toggleExpand = (id) => {
        setExpandedReport(expandedReport === id ? null : id);
    };

    const downloadPDF = async (reportId) => {
        try {
            const element = document.querySelector(`[data-report-id='${reportId}']`);
            if (!element) {
                console.error("Report element not found!");
                return;
            }

            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("landscape", "mm", "a4");
            pdf.addImage(imgData, "PNG", 10, 10, 280, 190); // Adjust margins to fit content
            pdf.save(`Weekly_Report_${reportId}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    if (loading) {
        return <p className="text-center text-lg text-yellow-700">Loading...</p>;
    }

    return (
        <div style={BgStyle} className="min-h-screen overflow-hidden">
            <div className="min-h-screen bg-white/60 backdrop-blur-md p-10 flex flex-col items-center">
                <h1 className="text-4xl font-extrabold text-black mb-12 text-center">
                    Weekly Report
                </h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                    Location: {location}
                </h2>

                <div className="w-full max-w-5xl">
                    {reports.length === 0 ? (
                        <p className="text-center text-gray-500">
                            No reports available for this location.
                        </p>
                    ) : (
                        reports.map((report) => (
                            <div
                                key={report.id}
                                className="bg-yellow-100 p-4 rounded-lg shadow-md mb-4"
                            >
                                <div
                                    className="cursor-pointer"
                                    onClick={() => toggleExpand(report.id)}
                                >
                                    <h3 className="text-lg font-bold text-yellow-800">
                                        Week of {report.date}
                                    </h3>
                                </div>

                                {expandedReport === report.id && (
                                    <div
                                        data-report-id={report.id}
                                        className="mt-4 bg-white p-6 rounded-lg shadow-md"
                                    >
                                        <table className="w-full border-collapse border border-gray-300">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-300 px-2 py-1" rowSpan="2">Items</th>
                                                    <th className="border border-gray-300 px-2 py-1" colSpan="2">Monday</th>
                                                    <th className="border border-gray-300 px-2 py-1" colSpan="2">Tuesday</th>
                                                    <th className="border border-gray-300 px-2 py-1" colSpan="2">Wednesday</th>
                                                    <th className="border border-gray-300 px-2 py-1" colSpan="2">Thursday</th>
                                                    <th className="border border-gray-300 px-2 py-1" colSpan="2">Friday</th>
                                                    <th className="border border-gray-300 px-2 py-1" colSpan="2">Saturday</th>
                                                    <th className="border border-gray-300 px-2 py-1" colSpan="2">Sunday</th>
                                                    <th className="border border-gray-300 px-2 py-1" rowSpan="2">Total</th>
                                                </tr>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-300 px-2 py-1">AM</th>
                                                    <th className="border border-gray-300 px-2 py-1">PM</th>
                                                    <th className="border border-gray-300 px-2 py-1">AM</th>
                                                    <th className="border border-gray-300 px-2 py-1">PM</th>
                                                    <th className="border border-gray-300 px-2 py-1">AM</th>
                                                    <th className="border border-gray-300 px-2 py-1">PM</th>
                                                    <th className="border border-gray-300 px-2 py-1">AM</th>
                                                    <th className="border border-gray-300 px-2 py-1">PM</th>
                                                    <th className="border border-gray-300 px-2 py-1">AM</th>
                                                    <th className="border border-gray-300 px-2 py-1">PM</th>
                                                    <th className="border border-gray-300 px-2 py-1">AM</th>
                                                    <th className="border border-gray-300 px-2 py-1">PM</th>
                                                    <th className="border border-gray-300 px-2 py-1">AM</th>
                                                    <th className="border border-gray-300 px-2 py-1">PM</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(report.items).map((itemName, idx) => {
                                                    const item = report.items[itemName];
                                                    return (
                                                        <tr key={idx}>
                                                            <td className="border border-gray-300 px-2 py-1">{itemName}</td>
                                                            <td className="border border-gray-300 px-2 py-1">{item.MondayAM || 0}</td>
                                                            <td className="border border-gray-300 px-2 py-1">{item.MondayPM || 0}</td>
                                                            <td className="border border-gray-300 px-2 py-1">{item.TuesdayAM || 0}</td>
                                                            <td className="border border-gray-300 px-2 py-1">{item.TuesdayPM || 0}</td>
                                                            <td className="border border-gray-300 px-2 py-1">{item.WednesdayAM || 0}</td>
                                                            <td className="border border-gray-300 px-2 py-1">{item.WednesdayPM || 0}</td>
                                                            <td className="border border-gray-300 px-2 py-1">{item.ThursdayAM || 0}</td>
                                                            <td className="border border-gray-300 px-2 py-1">{item.ThursdayPM || 0}</td>
                                                            <td className="border border-gray-300 px-2 py-1">{item.FridayAM || 0}</td>
                                                            <td className="border border-gray-300 px-2 py-1">{item.FridayPM || 0}</td>
                                                            <td className="border border-gray-300 px-2 py-1">{item.SaturdayAM || 0}</td>
                                                            <td className="border border-gray-300 px-2 py-1">{item.SaturdayPM || 0}</td>
                                                            <td className="border border-gray-300 px-2 py-1">{item.SundayAM || 0}</td>
                                                            <td className="border border-gray-300 px-2 py-1">{item.SundayPM || 0}</td>
                                                            <td className="border border-gray-300 px-2 py-1">{item.Total || 0}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                        <button
                                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                            onClick={() => downloadPDF(report.id)}
                                        >
                                            Download as PDF
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <button
                    className="mt-6 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    onClick={() => navigate("/dashboard/reports")}
                >
                    Back to Reports
                </button>
            </div>
        </div>
    );
};

export default WeeklyReport;
