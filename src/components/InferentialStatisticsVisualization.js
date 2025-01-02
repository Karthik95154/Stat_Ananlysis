import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InferentialStatisticsVisualization from "./InferentialStatisticsVisualization";

describe("InferentialStatisticsVisualization Component", () => {
  test("renders default Hypothesis Testing chart", () => {
    render(<InferentialStatisticsVisualization />);
    expect(screen.getByText("Z-Test")).toBeInTheDocument();
    expect(screen.getByText("Frequency of Use")).toBeInTheDocument();
  });

  test("renders P-values and Significance Levels chart", () => {
    render(<InferentialStatisticsVisualization />);
    fireEvent.change(screen.getByLabelText("Select Topic:"), {
      target: { value: "P-values and Significance Levels" },
    });
    expect(screen.getByText("Proportion of Use")).toBeInTheDocument();
    expect(screen.getByText("0.05")).toBeInTheDocument();
  });

  test("renders Confidence Intervals chart", () => {
    render(<InferentialStatisticsVisualization />);
    fireEvent.change(screen.getByLabelText("Select Topic:"), {
      target: { value: "Confidence Intervals" },
    });
    expect(screen.getByText("Confidence Interval Usage")).toBeInTheDocument();
    expect(screen.getByText("99%")).toBeInTheDocument();
  });

  test("renders Sampling Methods chart", () => {
    render(<InferentialStatisticsVisualization />);
    fireEvent.change(screen.getByLabelText("Select Topic:"), {
      target: { value: "Sampling Methods" },
    });
    expect(screen.getByText("Types of Sampling")).toBeInTheDocument();
    expect(screen.getByText("Cluster Sampling")).toBeInTheDocument();
  });

  test("dropdown contains all topics", () => {
    render(<InferentialStatisticsVisualization />);
    const dropdown = screen.getByLabelText("Select Topic:");
    expect(dropdown).toHaveTextContent("Hypothesis Testing");
    expect(dropdown).toHaveTextContent("P-values and Significance Levels");
    expect(dropdown).toHaveTextContent("Confidence Intervals");
    expect(dropdown).toHaveTextContent("Sampling Methods");
  });

  test("default topic is Hypothesis Testing", () => {
    render(<InferentialStatisticsVisualization />);
    const dropdown = screen.getByLabelText("Select Topic:");
    expect(dropdown.value).toBe("Hypothesis Testing");
  });

  test("renders correctly on small screen sizes", () => {
    window.innerWidth = 320; // Simulate mobile screen
    render(<InferentialStatisticsVisualization />);
    expect(screen.getByText("Inferential Statistics Visualization")).toBeInTheDocument();
  });

  test("correct chart type for each topic", () => {
    render(<InferentialStatisticsVisualization />);
    fireEvent.change(screen.getByLabelText("Select Topic:"), {
      target: { value: "P-values and Significance Levels" },
    });
    expect(screen.getByText("Proportion of Use")).toBeInTheDocument(); // Pie chart check
  });
});
