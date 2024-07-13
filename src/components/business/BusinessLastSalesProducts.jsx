import { NextUIProvider } from '@nextui-org/system';
import { getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';

const BusinessLastSalesProducts = ({ orders }) => {
  const rows = orders
    .map((orders) => orders.items)
    .flat(1)
    .map((product) => {
      return {
        key: product.id,
        name: product.name,
        amount: product.OrderProduct.amount,
      };
    });

  const columns = [
    {
      label: 'Nombre',
      key: 'name',
    },
    {
      label: 'Cantidad',
      key: 'amount',
    },
  ];
  return (
    <NextUIProvider>
      <Table>
        <TableHeader columns={columns}>{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
        <TableBody items={rows}>{(item) => <TableRow key={item.key}>{(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}</TableRow>}</TableBody>
      </Table>
    </NextUIProvider>
  );
};

export default BusinessLastSalesProducts;
