// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../../../Firebase/firebaseConfig.js"; // Adjust this import as per your project structure
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import BgImage from "../../../assets/BgImage.jpg";

const BgStyle = {
    backgroundImage: `url(${BgImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
};

const DailyReport = () => {
    const { location } = useParams();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedReport, setExpandedReport] = useState(null); // State for expanded report

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const q = query(
                    collection(db, "dailyreport"),
                    where("branch", "==", location),
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
                console.error("Error fetching reports:", error);
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

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const canvasHeight = canvas.height;
            const canvasWidth = canvas.width;
            const ratio = canvasWidth / pdfWidth;

            const imgHeightInPDF = canvasHeight / ratio;
            let currentHeight = 0;

            while (currentHeight < imgHeightInPDF) {
                const croppedCanvas = document.createElement("canvas");
                croppedCanvas.width = canvas.width;
                croppedCanvas.height = Math.min(canvas.height - currentHeight * ratio, pdfHeight * ratio);

                const ctx = croppedCanvas.getContext("2d");
                ctx.drawImage(
                    canvas,
                    0,
                    currentHeight * ratio,
                    canvas.width,
                    croppedCanvas.height,
                    0,
                    0,
                    croppedCanvas.width,
                    croppedCanvas.height
                );

                const croppedImgData = croppedCanvas.toDataURL("image/png");

                if (currentHeight > 0) {
                    pdf.addPage();
                }

                const croppedHeightInPDF = croppedCanvas.height / ratio;
                pdf.addImage(croppedImgData, "PNG", 0, 0, pdfWidth, croppedHeightInPDF);

                currentHeight += pdfHeight;
            }

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
                    Daily Reports
                </h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                    Location: {location}
                </h2>

                <div className="w-full max-w-5xl">
                    {reports.length === 0 ? (
                        <p className="text-center text-gray-700">
                            No reports available for this location.
                        </p>
                    ) : (
                        reports.map((report) => (
                            <div
                                key={report.id}
                                className="bg-yellow-100 p-4 rounded-lg shadow-md mb-4"
                            >
                                {/* Collapsed View */}
                                <div
                                    className="cursor-pointer"
                                    onClick={() => toggleExpand(report.id)}
                                >
                                    <h3 className="text-lg font-bold text-yellow-800">
                                        Name: {report.name}
                                    </h3>
                                    <h4 className="text-md font-semibold">
                                        Date: {report.date || "N/A"}
                                    </h4>
                                </div>

                                {/* Expanded View */}
                                {expandedReport === report.id && (
                                    <div
                                        data-report-id={report.id}
                                        className="mt-4"
                                    >
                                        <div
                                            key={report.id}
                                            data-report-id={report.id}
                                            className="w-full max-w-5xl bg-yellow-100 p-6 rounded-lg shadow-md mb-8"
                                        >
                                            <h3 className="text-lg font-bold mb-4 text-yellow-800">
                                                Name: {report.name}
                                            </h3>
                                            <h3 className="text-lg font-bold mb-4 text-yellow-800">
                                                Branch: {report.branch}
                                            </h3>
                                            <h4 className="text-md font-semibold mb-4">
                                                Date: {report.date || "N/A"} | Shift: {report.shift}
                                            </h4>

                                            {/* Items Section */}
                                            <div className="overflow-x-auto mb-6">
                                                <table className="min-w-full table-auto text-left text-gray-800">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2">Item</th>
                                                            <th className="px-4 py-2">Starting</th>
                                                            <th className="px-4 py-2">Delivery</th>
                                                            <th className="px-4 py-2">Waste</th>
                                                            <th className="px-4 py-2">Ending</th>
                                                            <th className="px-4 py-2">Sold</th>
                                                            <th className="px-4 py-2">Price</th>
                                                            <th className="px-4 py-2">Sales</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {report.items.map((item, i) => (
                                                            <tr key={i} className="border-b">
                                                                <td className="px-4 py-2">{item.name}</td>
                                                                <td className="px-4 py-2">{item.starting}</td>
                                                                <td className="px-4 py-2">{item.delivery}</td>
                                                                <td className="px-4 py-2">{item.waste}</td>
                                                                <td className="px-4 py-2">{item.ending}</td>
                                                                <td className="px-4 py-2">{item.sold}</td>
                                                                <td className="px-4 py-2">₱{item.price.toFixed(2)}</td>
                                                                <td className="px-4 py-2">₱{item.sales.toFixed(2)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Subtotals Section */}
                                            <div className="mb-6">
                                                <h4 className="text-md font-bold">Subtotals:</h4>
                                                <table className="min-w-full table-auto text-left text-gray-800">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2">Product Group</th>
                                                            <th className="px-4 py-2">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className="border-b">
                                                            <td className="px-4 py-2">AB Products</td>
                                                            <td className="px-4 py-2">
                                                                ₱
                                                                {report.items
                                                                    ? report.items
                                                                        .filter((item) => item.subtotals === "abProducts")
                                                                        .reduce((total, item) => total + item.sales, 0)
                                                                        .toFixed(2)
                                                                    : "0.00"}
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b">
                                                            <td className="px-4 py-2">Pepsi Products</td>
                                                            <td className="px-4 py-2">
                                                                ₱
                                                                {report.items
                                                                    ? report.items
                                                                        .filter((item) => item.subtotals === "pepsiProducts")
                                                                        .reduce((total, item) => total + item.sales, 0)
                                                                        .toFixed(2)
                                                                    : "0.00"}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Condiments Section */}
                                            <div className="mb-6">
                                                <h4 className="text-md font-bold">Condiments:</h4>
                                                <table className="min-w-full table-auto text-left text-gray-800">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2">Name</th>
                                                            <th className="px-4 py-2">Starting</th>
                                                            <th className="px-4 py-2">Closing</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {report.condiments.map((condiment, i) => (
                                                            <tr key={i} className="border-b">
                                                                <td className="px-4 py-2">{condiment.name}</td>
                                                                <td className="px-4 py-2">{condiment.starting}</td>
                                                                <td className="px-4 py-2">{condiment.closing}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* LPG Section */}
                                            <div className="mb-6">
                                                <h4 className="text-md font-bold">LPG:</h4>
                                                <table className="min-w-full table-auto text-left text-gray-800">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2">Type</th>
                                                            <th className="px-4 py-2">Starting</th>
                                                            <th className="px-4 py-2">Closing</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {report.lpg.map((lpg, i) => (
                                                            <tr key={i} className="border-b">
                                                                <td className="px-4 py-2">{lpg.type}</td>
                                                                <td className="px-4 py-2">{lpg.starting}</td>
                                                                <td className="px-4 py-2">{lpg.closing}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Cash Breakdown Section */}
                                            <div className="mb-6">
                                                <h4 className="text-md font-bold">Cash Breakdown:</h4>
                                                <table className="min-w-full table-auto text-left text-gray-800">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2">Denomination</th>
                                                            <th className="px-4 py-2">Quantity</th>
                                                            <th className="px-4 py-2">= P</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(report.cashBreakdown || []).map((cash, i) => (
                                                            <tr key={i} className="border-b">
                                                                <td className="px-4 py-2">
                                                                    {cash.denomination === "Coins"
                                                                        ? cash.denomination
                                                                        : `₱${cash.denomination}`}
                                                                </td>
                                                                <td className="px-4 py-2">{cash.quantity}</td>
                                                                <td className="px-4 py-2">
                                                                    ₱{cash.P ? cash.P.toFixed(2) : "0.00"}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>

                                                {/* Total P Value */}
                                                <div className="mt-4 font-semibold text-gray-800">
                                                    <p>
                                                        **Total P Value: ₱
                                                        {report.cashBreakdown
                                                            ? report.cashBreakdown.reduce(
                                                                (total, cash) => total + (cash.P || 0),
                                                                0
                                                            ).toFixed(2)
                                                            : "0.00"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Summary */}
                                            <div className="mb-6">
                                                <h4 className="text-md font-bold">Summary:</h4>
                                                <p>Total Sales: ₱{report.summary.totalSales}</p>
                                                <p>Expenses: ₱{report.summary.expenses}</p>
                                                <p>Senior Discount: ₱{report.summary.seniorDiscount}</p>
                                                <p>Cash on Hand: ₱{report.summary.cashOnHand}</p>
                                            </div>

                                            {/* Serial Numbers */}
                                            <div className="mb-6">
                                                <h4 className="text-md font-bold">Write the Serial Numbers:</h4>
                                                <p>{report.serialNumbers || "N/A"}</p>
                                            </div>

                                            <div className="mb-6">
                                                <h4 className="text-md font-bold">ITO AY PATUNAY NA LAHAT NG DETALYE AT PERA NA NAKASAAD SA REPORT NA ITO AY WASTO AT KUMPLETO</h4>
                                                <p>{report.outgoingCrew || "N/A"}</p>
                                                <p>{report.incomingCrew || "N/A"}</p>
                                            </div>

                                            <div className="mb-6">
                                                <h4 className="text-md font-bold">***Do not write below this line***</h4>
                                                <p>Commission: ₱{report.dnwbtl.commission}</p>
                                                <p>Short: ₱{report.dnwbtl.short}</p>
                                                <p>Over: ₱{report.dnwbtl.over}</p>
                                            </div>

                                            <button
                                                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-all mt-4"
                                                onClick={() => downloadPDF(report.id)}
                                            >
                                                Download this Report as PDF
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                        ))}
                </div>
                <div className="mt-10">
                    <button
                        className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-all"
                        onClick={() => navigate("/dashboard/reports")}
                    >
                        Back to Reports
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailyReport;
