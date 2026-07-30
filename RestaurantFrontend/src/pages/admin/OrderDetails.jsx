import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";

export default function OrderDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [order, setOrder] = useState(null);

    useEffect(() => {
        loadOrder();
    }, []);

    async function loadOrder() {

        try {

            const response = await api.get(`/orders/${id}`);

            setOrder(response.data);

        }

        catch (error) {

            console.log(error);

        }

    }

    if (!order) {

        return (

            <AdminLayout>

                <h2 className="text-2xl font-bold">
                    Loading Order...
                </h2>

            </AdminLayout>

        );

    }

    return (

        <AdminLayout>

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800"
            >
                <ArrowLeft size={20}/>
                Back
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-8">

                <h1 className="text-4xl font-bold mb-8">

                    Order #{order.id}

                </h1>

                <div className="grid grid-cols-2 gap-8">

                    <div>

                        <h2 className="text-xl font-semibold mb-3">

                            Customer Information

                        </h2>

                        <p>

                            <strong>Name:</strong> {order.customerName}

                        </p>

                        <p>

                            <strong>Email:</strong> {order.customerEmail}

                        </p>

                    </div>

                    <div>

                        <h2 className="text-xl font-semibold mb-3">

                            Order Information

                        </h2>

                        <p>

                            <strong>Status:</strong> {order.status}

                        </p>

                        <p>

                            <strong>Date:</strong>{" "}

                            {new Date(order.createdAt).toLocaleString()}

                        </p>

                        <p className="text-2xl font-bold mt-3 text-green-600">

                            Rs. {Number(order.totalAmount).toLocaleString()}

                        </p>

                    </div>

                </div>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

                <h2 className="text-2xl font-bold mb-6">

                    Order Items

                </h2>

                <table className="w-full">

                    <thead className="border-b">

                        <tr>

                            <th className="text-left py-4">

                                Item

                            </th>

                            <th className="text-left">

                                Quantity

                            </th>

                            <th className="text-left">

                                Price

                            </th>

                            <th className="text-left">

                                Subtotal

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {order.items.map(item => (

                            <tr
                                key={item.menuItemId}
                                className="border-b"
                            >

                                <td className="py-4">

                                    {item.menuItemName}

                                </td>

                                <td>

                                    {item.quantity}

                                </td>

                                <td>

                                    Rs. {item.price}

                                </td>

                                <td>

                                    Rs. {item.subtotal}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </AdminLayout>

    );

}