import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from '@/components/ui/table';

interface Spec {
    label: string;
    value: string;
}

interface ProductSpecsProps {
    specifications: Spec[];
}

export default function ProductSpecs({ specifications }: ProductSpecsProps) {
    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Specifications</h3>
            <Table>
                <TableBody>
                    {specifications.map((spec, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium w-1/3">{spec.label}</TableCell>
                            <TableCell>{spec.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}