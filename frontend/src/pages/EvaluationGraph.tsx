// Enhanced EvaluationGraph.tsx
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "../hooks/axios/axios";
import styles from "../styles/EvaluationGraph.module.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface TestResult {
    score: number;
    timestamp?: string;
    date?: string;
}

interface ApiResponse {
    testResults: TestResult[];
}

const EvaluationGraph = () => {
    const rawScore = localStorage.getItem("evaluationScore");
    const score = rawScore ? parseInt(rawScore, 10) : 0;
    const maxScore = 20;
    const [results, setResults] = useState<number[]>([]); // Array of numbers
    const [resultsLoading, setResultsLoading] = useState(false);
    const [testDates, setTestDates] = useState<string[]>([]);

    useEffect(() => {
        setResultsLoading(true);
        axios
            .get<ApiResponse>("/test", { withCredentials: true })
            .then(({ data }) => {
                if (data.testResults && data.testResults.length > 0) {
                    // Convert scores to percentages and get dates
                    const percentages = data.testResults.map((doc: TestResult) => (doc.score / maxScore) * 100);
                    const dates = data.testResults.map((doc: TestResult) => {
                        const date = new Date(doc.timestamp || doc.date || Date.now());
                        return date.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                        });
                    });
                    
                    console.log("Percentages:", percentages);
                    console.log("Dates:", dates);
                    setResults(percentages);
                    setTestDates(dates);
                } else {
                    // Fallback to current score if no historical data
                    const currentPercentage = (score / maxScore) * 100;
                    setResults([currentPercentage]);
                    setTestDates([new Date().toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                    })]);
                }
                setResultsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                // Fallback to current score
                const currentPercentage = (score / maxScore) * 100;
                setResults([currentPercentage]);
                setTestDates([new Date().toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                })]);
                setResultsLoading(false);
            });
    }, [score]);

    const getScoreColor = (percentage: number) => {
        if (percentage <= 25) return "#4ade80"; // Green - Good
        if (percentage <= 50) return "#facc15"; // Yellow - Mild concern
        if (percentage <= 75) return "#f97316"; // Orange - Moderate risk
        return "#ef4444"; // Red - High risk
    };

    const getScoreLabel = (percentage: number) => {
        if (percentage <= 25) return "Good";
        if (percentage <= 50) return "Mild";
        if (percentage <= 75) return "Moderate";
        return "High Risk";
    };

    const data = {
        labels: testDates.length > 0 ? testDates : results.map((_, index) => `Test ${index + 1}`),
        datasets: [
            {
                label: "Evaluation Score (%)",
                data: resultsLoading ? [] : results,
                backgroundColor: results.map(score => getScoreColor(score)),
                borderRadius: 8,
                borderWidth: 2,
                borderColor: results.map(score => getScoreColor(score)),
                hoverBackgroundColor: results.map(score => getScoreColor(score)),
                hoverBorderColor: results.map(score => getScoreColor(score)),
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value: any) {
                        return value + '%';
                    },
                    color: '#64748b',
                    font: {
                        size: 12,
                        weight: 'normal' as const
                    }
                },
                grid: {
                    color: 'rgba(100, 116, 139, 0.1)',
                    drawBorder: false
                }
            },
            x: {
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 11,
                        weight: 'normal' as const
                    },
                    maxRotation: 45,
                    minRotation: 0
                },
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: { 
                display: false 
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1e293b',
                bodyColor: '#64748b',
                borderColor: 'rgba(102, 126, 234, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    title: function(context: any) {
                        return `Test on ${context[0].label}`;
                    },
                    label: function(context: any) {
                        const percentage = context.parsed.y;
                        const score = Math.round((percentage / 100) * maxScore);
                        return [
                            `Score: ${score}/${maxScore}`,
                            `Percentage: ${Math.round(percentage)}%`,
                            `Status: ${getScoreLabel(percentage)}`
                        ];
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index' as const
        }
    };

    if (resultsLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading evaluation data...</p>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className={styles.noDataContainer}>
                <p>No evaluation data available</p>
                <p className={styles.suggestion}>Complete an evaluation to see your results here!</p>
            </div>
        );
    }

    return (
        <div className={styles.graphContainer}>
            <div className={styles.graphHeader}>
                <h4 className={styles.graphTitle}>Your Evaluation History</h4>
                <p className={styles.graphSubtitle}>
                    Track your mental wellness scores over time
                </p>
            </div>
            
            <div className={styles.chartWrapper}>
                <Bar data={data} options={options} />
            </div>
            
            <div className={styles.legendContainer}>
                <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: "#4ade80" }}></div>
                    <span>Good (0-25%)</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: "#facc15" }}></div>
                    <span>Mild (26-50%)</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: "#f97316" }}></div>
                    <span>Moderate (51-75%)</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: "#ef4444" }}></div>
                    <span>High Risk (76-100%)</span>
                </div>
            </div>
        </div>
    );
};

export default EvaluationGraph;
