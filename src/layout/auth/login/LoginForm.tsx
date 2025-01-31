import { Button } from "@/components/ui/button";
import SwitchAuthLink from "@/components/SwitchLink";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { useFormik } from 'formik';
import LoadingSpinnerComponent from 'react-spinners-components';
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email: string[];
    password: string[];
}

interface ErrorResponse {
    message: string;
    errors?: {
        [field: string]: string[];
    };
    data?: {
        [field: string]: string[];
    };
    verification?: {
        [field: string]: string[];
    };
}

const LoginForm = () => {
    const { push } = useRouter();
    const { toast } = useToast()

    const [formErrors, setFormErrors] = useState<FormErrors>({
        email: [],
        password: [],
    });

    const handleValidation = (errors: { email: string[]; password: string[] }) => {
        setFormErrors({
            email: errors.email || [],
            password: errors.password || [],
        });
    };

    const { mutate } = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await axiosInstance.post('/job-entry/login', data);
            return response;
        },
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            const data = err?.response?.data
            if (err.response?.status === 400 && err.response.data.errors) {
                handleValidation({
                    email: err.response?.data?.errors?.email ?? [],
                    password: err.response?.data?.errors?.password ?? [],
                });
            }
            if (err.response?.status === 403) {
                toast({
                    description: "user is inactive",
                })
                setTimeout(() => push(`/verify-email?token=${data?.verification?.token}`), 5000);
            }
            const fields = ['email', 'password'];
            fields.forEach(field => formik.setFieldValue(field, ''));
            handleValidation({
                email: [],
                password: [],
            })
        },
        onSuccess: async (data) => {
            const dataApi = data.data
            toast({
                description: "success login",
            })
            setTimeout(() => push(`/`), 5000);
        },
    })

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: (values, { setSubmitting }) => {
            try {
                const { email, password } = values
                mutate({
                    email,
                    password
                })
            } catch (error) {
                console.error('Terjadi kesalahan:', error);
            } finally {
                setSubmitting(false);
            }
        },
    })

    return (
        <div className="bg-[#12141e] lg:w-[45%] md:w-[45%] w-[90%] p-8 rounded-md mt-9 border-[#1f2236] border-2">
            <p className="text-2xl font-bold mb-3 text-white text-center">Login</p>
            <form action="" onSubmit={formik.handleSubmit}>
                <div className="flex flex-col mb-3">
                    <Input
                        type='text'
                        placeholder='email' name="email"
                        className="caret-white mb-1 border-[#1b1d2e] border-2 focus:border-[#4b5fe2]" onChange={formik.handleChange} value={formik.values.email}
                    />
                    {formErrors.email.map((error, index) => (
                        <p key={index} className="text-red-500 text-sm">{error}</p>
                    ))}
                </div>
                <div className="flex flex-col mb-3">
                    <Input
                        type='password'
                        placeholder='password' name="password"
                        className="caret-white mb-1 border-[#1b1d2e] border-2 focus:border-[#4b5fe2]" onChange={formik.handleChange} value={formik.values.password}
                    />
                    {formErrors.password.map((error, index) => (
                        <p key={index} className="text-red-500 text-sm">{error}</p>
                    ))}
                </div>
                <Button className="bg-[#4b5fe2] hover:bg-[#4558cf] w-full" type="submit">
                    {formik.isSubmitting ? (
                        <div className="flex flex-row text-white items-center cursor-pointer">
                            <LoadingSpinnerComponent type={'Spinner'} color={'white'} size={'100px'} />
                            <p className="ms-1">Login</p>
                        </div>
                    ) : "Login"}
                </Button>
                <SwitchAuthLink switchText="Dont have an account?" switchLink="/register" Category="login" />
            </form>
        </div>
    );
}

export default LoginForm