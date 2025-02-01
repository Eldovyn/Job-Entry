'use client'
import IconEmail from "@/../public/iconEmailVerification.png"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const Page = () => {
    const { push } = useRouter();
    const searchParams = useSearchParams();
    const [isLoadingResend, setIsLoadingResend] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const { data, isError, error } = useQuery({
        queryKey: ['page-reset-password'],
        queryFn: async () => {
            const token = searchParams.get('token');
            const response = await axiosInstance.get(`/job-entry/page/reset-password`, {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    token
                },
            });
            return response;
        },
        refetchOnWindowFocus: false,
        retry: false,
    });

    useEffect(() => {
        if (isError) {
            setShouldRedirect(true);
        }
    }, [isError]);

    useEffect(() => {
        if (shouldRedirect) {
            push(`/forgot-password`);
        }
    }, [shouldRedirect, push]);

    const handleResendEmail = async () => {
        setIsLoadingResend(true);
        try {
            const response = await axiosInstance.patch('/job-entry/re-send/reset-password', { email: data?.data.data.email });
            const resp = response.data;
            push(`/forgot-password/sent?token=${resp.reset_password.token}`);
        } catch (error) {
            push(`/forgot-password`);
        }
        setIsLoadingResend(false);
    };

    return (
        <div className="bg-[#0b0d14] h-screen flex items-center justify-center w-full text-white">
            <div className="bg-[#12141e] lg:w-[45%] md:w-[60%] sm:w-[70%] w-[90%] p-8 rounded-md mt-9 border-[#1f2236] border-2">
                <p className="text-white text-xl font-semibold text-center">
                    {`Great ${data?.data.data.username}, Now Check Your Email`}
                </p>
                <Image src={IconEmail} alt="icon email" className="w-[25%] mx-auto" />
                <p className="text-white text-sm mt-3">
                    {`Check your inbox at ${data?.data.data.email} and click the reset password link inside to complete your change password. This link will expire shortly, so reset your password soon!`}
                </p>
                <div className="flex md:flex-row lg:flex-row sm:flex-col flex-col text-sm mt-2">
                    <p className="text-white">Didn't receive the email?</p>
                    <p className="text-gray-400 md:ms-1 lg:ms-1">Check your spam folder.</p>
                </div>
                <div className="flex md:flex-row lg:flex-row sm:flex-col flex-col text-sm">
                    <p className="text-white">Link expired?</p>
                    <p
                        className="text-blue-600 md:ms-1 lg:ms-1 cursor-pointer"
                        onClick={isLoadingResend ? () => {} : handleResendEmail}
                    >
                        Resend reset password email.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page