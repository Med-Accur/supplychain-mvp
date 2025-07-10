import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
} from 'recharts';
import React from 'react';

const data = [
  { name: 'Jan', uv: 400, pv: 240 },
  { name: 'Feb', uv: 300, pv: 139 },
  { name: 'Mar', uv: 200, pv: 980 },
  { name: 'Apr', uv: 278, pv: 390 },
  { name: 'May', uv: 189, pv: 480 },
  { name: 'Jun', uv: 239, pv: 380 },
  { name: 'Jul', uv: 349, pv: 430 },
  { name: 'Aug', uv: 400, pv: 210 },
  { name: 'Sep', uv: 300, pv: 250 },
  { name: 'Oct', uv: 200, pv: 310 },
  { name: 'Nov', uv: 278, pv: 470 },
  { name: 'Dec', uv: 189, pv: 300 },
];

const ChartWidget = () => (
  
  <div className="w-full h-full min-w-[300px] min-h-[200px] p-0">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }} // <-- Moins de marges internes
      >
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default ChartWidget;
