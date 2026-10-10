import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import {
  Table,
  tdClass,
  tdStrongClass,
  thClass,
  theadClass,
  trClass,
} from "@/components/ui/Table";

type Column = { key: string; label: string };
type Row = Record<string, string>;

export default function SimpleModule({
  title,
  description,
  columns,
  rows,
}: {
  title: string;
  description: string;
  columns: Column[];
  rows: Row[];
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <Card className="overflow-hidden p-0">
        <Table minWidth="640px">
          <thead className={theadClass}>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={thClass}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id || row.name} className={trClass}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={
                      column.key === columns[0].key ? tdStrongClass : tdClass
                    }
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
