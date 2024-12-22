/* eslint-enable no-undef */
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2"; // Import Bar chart component instead of Line
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TimeScale, Filler } from "chart.js"; // Import Filler plugin

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";
import { toast } from "react-toastify";
import { apiEndPoint } from "../../utils/constants";
import axios, { config } from "../../utils/api";

// Import the date adapter for Chart.js
import 'chartjs-adapter-date-fns';

// Register Chart.js components and the Filler plugin
Chart.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TimeScale, Filler );

const Pending_Graph = () => {
    const [ chartData, setChartData ] = useState( {} );

    useEffect( () => {
        const fetchData = async () => {
            try {
                const loggedInUsername = localStorage.getItem( "username" );

                if ( !loggedInUsername ) {
                    console.error( "No logged-in username found in localStorage." );
                    return;
                }

                // Fetch the approved inventories (Main Data)
                const inventoriesEndpoint = `${ apiEndPoint.list }?status=pending`;
                const res = await axios.get( inventoriesEndpoint, config() );

                // Fetch the approved inventories count (Counts Data)
                const counter = await axios.get( apiEndPoint.inventories_pending_count, config() );

                if ( res.data && counter.data ) {
                    // Debugging logs to inspect response
                    console.log( "Full API Response Data:", res.data );
                    console.log( "Count Data:", counter.data );

                    // Map through the response data for dates (labels) and ensure they are valid
                    const labels = res.data.map( ( item ) => {
                        const dateStr = item.craeted_at; // Assuming 'updated_at' is the correct date field
                        console.log( "Item Date:", dateStr ); // Log the date to inspect its format

                        const date = new Date( dateStr );  // Try to create a new Date object from the date string
                        if ( isNaN( date ) ) {
                            console.warn( "Invalid date for item:", item );
                            return null; // Return null if invalid date
                        }
                        return date.toISOString(); // Convert to ISO string for chart
                    } ).filter( Boolean ); // Filter out any invalid dates

                    // Ensure the counts map correctly to each date
                    const counts = Array.isArray( counter.data )
                        ? counter.data.map( ( item ) => item.pending_count ) // If it's an array
                        : [ counter.data.pending_count ]; // If it's an object, get the count directly

                    console.log( "Labels Array:", labels );
                    console.log( "Counts Array:", counts );

                    // Update chart data state
                    setChartData( {
                        labels: labels,
                        datasets: [
                            {
                                label: "Approved Inventories",
                                data: counts,
                                borderColor: "#f57c00",
                                backgroundColor: "rgba(245, 124, 0, 0.2)",
                                fill: true,
                                tension: 0.4,
                            },
                        ],
                    } );
                }
            } catch ( error ) {
                console.error( "Error fetching data:", error );
                toast.error( "Failed to fetch inventory data." );
            }
        };

        fetchData();
    }, [] ); // Only run once when the component mounts

    return (
        <div className="main--container">
            <Sidebar />
            <div className="main--navbar light-blue">
                <Header />
                <div className="graph-container">
                    <h2>Approved Inventories Trend</h2>
                    {chartData.labels ? (
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: "top",
                                    },
                                    tooltip: {
                                        enabled: true,
                                    },
                                },
                                scales: {
                                    x: {
                                        type: "time", // Use time scale for the x-axis
                                        time: {
                                            unit: "day", // Define the unit (e.g., day, month)
                                            tooltipFormat: "PP", // Format for the tooltip (using 'PP' from date-fns)
                                            displayFormats: {
                                                day: 'MMM dd', // Format the date display
                                            },
                                        },
                                        title: {
                                            display: true,
                                            text: "Date",
                                        },
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: "Count",
                                        },
                                        beginAtZero: true, // Ensure Y-axis starts from 0
                                    },
                                },
                            }}
                        />
                    ) : (
                        <p>Loading graph...</p>
                    )}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Pending_Graph;
