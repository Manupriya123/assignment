// src/components/DataTable.tsx
import React, { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import './DataTable.css';

interface CropData {
  country: string;
  year: string;
  crop: string;
  production: number;
  yield: number;
  area: number;
}

const fetchJsonFromPublic = async (): Promise<CropData[]> => {
  try {
    const response = await fetch(`${process.env.PUBLIC_URL}/Manufac_India_Agro_Dataset.json`);
    if (!response.ok) {
      throw new Error(`Failed to load JSON data: ${response.status} ${response.statusText}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Expected JSON, but received ${contentType}`);
    }
    const data = await response.json();
    console.log('Fetched data:', data);
    return data.map((item: any) => ({
      country: item['Country'],
      year: item['Year'],
      crop: item['Crop Name'],
      production: parseFloat(item['Crop Production (UOM:t(Tonnes))']) || 0,
      yield: parseFloat(item['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))']) || 0,
      area: parseFloat(item['Area Under Cultivation (UOM:Ha(Hectares))']) || 0,
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const YearlyMaxMinTable = () => {
  const [data, setData] = useState<CropData[]>([]);
  const [processedData, setProcessedData] = useState<
    { year: string; maxCrop: string; minCrop: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = await fetchJsonFromPublic();
        setData(jsonData);
        console.log('JSON Data:', jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const yearlyData = data.reduce((acc, curr) => {
      const year = curr.year;
      if (!acc[year]) {
        acc[year] = {
          maxCrop: curr.crop,
          maxProduction: curr.production,
          minCrop: curr.crop,
          minProduction: curr.production,
        };
      } else {
        if (curr.production > acc[year].maxProduction) {
          acc[year].maxCrop = curr.crop;
          acc[year].maxProduction = curr.production;
        }
        if (curr.production < acc[year].minProduction) {
          acc[year].minCrop = curr.crop;
          acc[year].minProduction = curr.production;
        }
      }
      return acc;
    }, {} as Record<string, { maxCrop: string; maxProduction: number; minCrop: string; minProduction: number }>);

    const result = Object.entries(yearlyData).map(([year, { maxCrop, minCrop }]) => ({
      year,
      maxCrop,
      minCrop,
    }));
    console.log('Processed Data for YearlyMaxMinTable:', result);
    setProcessedData(result);
  }, [data]);

  return (
    <div className="table-container">
      <Table className="table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Max Crop</th>
            <th>Min Crop</th>
          </tr>
        </thead>
        <tbody>
          {processedData.map((row) => (
            <tr key={row.year}>
              <td>{row.year}</td>
              <td>{row.maxCrop}</td>
              <td>{row.minCrop}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const AverageYieldAndAreaTable = () => {
  const [data, setData] = useState<CropData[]>([]);
  const [processedData, setProcessedData] = useState<
    { crop: string; avgYield: string; avgArea: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = await fetchJsonFromPublic();
        setData(jsonData);
        console.log('JSON Data:', jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const cropStats = data.reduce((acc, curr) => {
      if (!acc[curr.crop]) {
        acc[curr.crop] = { totalYield: 0, totalArea: 0, count: 0 };
      }
      acc[curr.crop].totalYield += curr.yield;
      acc[curr.crop].totalArea += curr.area;
      acc[curr.crop].count += 1;
      return acc;
    }, {} as Record<string, { totalYield: number; totalArea: number; count: number }>);

    const result = Object.entries(cropStats).map(([crop, { totalYield, totalArea, count }]) => ({
      crop,
      avgYield: (totalYield / count).toFixed(3),
      avgArea: (totalArea / count).toFixed(3),
    }));
    console.log('Processed Data for AverageYieldAndAreaTable:', result);
    setProcessedData(result);
  }, [data]);

  return (
    <div className="table-container">
      <Table className="table">
        <thead>
          <tr>
            <th>Crop</th>
            <th>Average Yield</th>
            <th>Average Area</th>
          </tr>
        </thead>
        <tbody>
          {processedData.map((row) => (
            <tr key={row.crop}>
              <td>{row.crop}</td>
              <td>{row.avgYield}</td>
              <td>{row.avgArea}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export { YearlyMaxMinTable, AverageYieldAndAreaTable };
