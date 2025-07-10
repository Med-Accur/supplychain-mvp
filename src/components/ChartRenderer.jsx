import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ComposedChart
} from 'recharts';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#A79882', '#00C49F', '#FF8042', '#888888'];
dayjs.locale('fr');

export default function ChartRenderer({ data, type, dataKey, valueKey }) {
  if (!data || data.length === 0) return <p>Aucune donnée à afficher</p>;

  const formatDate = (date) => dayjs(date).format('DD MMM');

  /* ---------- Radial ---------- */
  if (type === "radial") {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <RadialBarChart
          innerRadius="20%"
          outerRadius="90%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey={valueKey}
            nameKey={dataKey}
            cornerRadius={5}
            background
            label={({ value }) => value}
          />
          <Legend
            iconType="circle"
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
    );
  }

  /* ---------- Stacked bar (par catégorie) ---------- */
  if (type === 'stackedBar') {
    const allTransporteurs = [...new Set(data.flatMap(d => Object.keys(d).filter(k => k !== 'date')))];
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatDate} />
          <YAxis />
          <Tooltip />
          <Legend />
          {allTransporteurs.map((t, i) => (
            <Bar key={t} dataKey={t} stackId="a" fill={COLORS[i % COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  /* ---------- Donut ---------- */
  if (type === "donut") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={dataKey}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  /* ---------- Combo (bar + ligne) ---------- */
  if (type === "combo") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKey} tickFormatter={formatDate} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={valueKey} fill="#82ca9d" />
          <Line type="monotone" dataKey={valueKey} stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  /* ---------- Simple line / bar ---------- */
  const ChartType = type === "line" ? LineChart : BarChart;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ChartType data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataKey} tickFormatter={formatDate} />
        <YAxis />
        <Tooltip />
        <Legend />
        {type === "line" ? (
          <Line type="monotone" dataKey={valueKey} stroke="#8884d8" />
        ) : (
          <Bar dataKey={valueKey} fill="#82ca9d" />
        )}
      </ChartType>
    </ResponsiveContainer>
  );
}
