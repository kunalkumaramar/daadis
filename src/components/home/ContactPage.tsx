import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, Phone, Store } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "sonner"; // Make sure you have sonner installed
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { sendInfluencerEmail, resetContactState, clearMessages } from "../../redux1/contactSlice";
import type { RootState, AppDispatch } from "../../redux1/store";

const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }).max(30, {message: "Cannot be more than 30 characters long!"}),
  email: z.string().email("Please enter a valid email address"),
  phoneNo: z.string().min(10, { message: "Phone number must be at least 10 digits" }).max(15, { message: "Phone number cannot exceed 15 digits" }),
  subject: z.string().min(1, { message: "Subject is required!" }).max(200, { message: "Subject cannot exceed 200 characters" }),
  message: z.string().min(1, { message: "Message is required!" }).max(1000, { message: "Message cannot exceed 1000 characters" })
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export const ContactPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, isSuccess, isError, message, errorMessage } = useSelector(
        (state: RootState) => state.contact
    );

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNo: "",
            subject: "",
            message: ""
        },
    });

    // Handle success and error states
    useEffect(() => {
        if (isSuccess && message) {
            toast.success(message);
            form.reset(); // Reset the form on successful submission
            dispatch(resetContactState());
        }

        if (isError && errorMessage) {
            toast.error(errorMessage);
            dispatch(clearMessages());
        }
    }, [isSuccess, isError, message, errorMessage, dispatch, form]);

    const onSubmit = (values: ContactFormData) => {
        // Transform form data to match API requirements
        const apiData = {
            name: values.name,
            email: values.email,
            phoneNumber: values.phoneNo, // Note: API expects 'phoneNumber', form has 'phoneNo'
            subject: values.subject,
            message: values.message
        };

        // Dispatch the API call
        dispatch(sendInfluencerEmail(apiData));
    };

    return (
        <div className="w-full flex flex-col min-h-[calc(100vh-56px)] mt-14">
            <section id="map" className="h-[30%]">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.1234567890123!2d77.5911101!3d12.9152953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15965ccbaed5%3A0x245fa4c9d95df125!2sMegharaj%20Marketing%20Private%20Limited!5e0!3m2!1sen!2sin!4v1693654321000" 
                    className="w-full h-full" 
                    loading="lazy"
                    title="Company Location"
                />
            </section>
            <section id="contact" className="flex-1 font-[quicksand] gap-5 p-6 h-auto flex flex-col sm:flex-row sm:flex">
                <div id="more-details" className="grid-cols-5 gap-4 p-4 rounded-lg grid sm:flex-[0.25] bg-gray-100/50 shadow-md">
                    <Mail className="col-span-1" />
                    <div className="col-span-4">
                        <a href="mailto:contact@meghrajgroup.com" className="hover:text-blue-600 transition-colors">
                            contact@meghrajgroup.com
                        </a>
                    </div>
                    <Phone className="col-span-1"/>
                    <div className="col-span-4">
                        <a href="tel:+919886402902" className="hover:text-blue-600 transition-colors">
                            +919886402902
                        </a>
                    </div>
                    <MapPin className="col-span-1" />
                    <div className="col-span-4 flex flex-col gap-2">
                        <h1 className="text-sm font-bold">Manufactured by (Unit-01):</h1>
                        <p className="text-xs">Plot No 48, No.-179, Jigani Industrial Area, First phase, Anekal Taluk,<br />Bengaluru Urban, Karnataka-562106</p>
                    </div>
                    <Store className="col-span-1" />
                    <div className="col-span-4 flex flex-col gap-2">
                        <h1 className="text-sm font-bold">Manufactured by (Unit-02):</h1>
                        <p className="text-xs">Shed No.:-03, Plot No:-322-A, Opposite:-HDFC Bank, Next to Indian Petrol Bunk, Bommasandra-Jigani<br /> link road, KIADB Industrial Area, Jigani, Anekal Taluk, Bengaluru Urban, Karnataka. - 560105</p>
                    </div>
                </div>
                <div id="contact-form" className="flex-[0.75] p-6 px-10 bg-gray-100/50 flex flex-col gap-4 rounded-lg shadow-md">
                    <h1 className="font-[quicksand] text-lg font-semibold">Looking forward to hearing from you</h1>
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-4 items-center gap-2">
                                    <Label className="col-span-1">Name<span className="text-red-500">*</span></Label>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="col-span-3">
                                                <FormControl className="col-span-3">
                                                    <Input 
                                                        placeholder="Enter your name" 
                                                        className="col-span-3" 
                                                        disabled={isLoading}
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="col-span-1">Email<span className="text-red-500">*</span></Label>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="col-span-3">
                                                <FormControl className="col-span-3">
                                                    <Input 
                                                        placeholder="Enter your email" 
                                                        type="email" 
                                                        className="col-span-3" 
                                                        disabled={isLoading}
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="col-span-1">Phone number<span className="text-red-500">*</span></Label>
                                    <FormField
                                        control={form.control}
                                        name="phoneNo"
                                        render={({ field }) => (
                                            <FormItem className="col-span-3">
                                                <FormControl className="col-span-3">
                                                    <Input 
                                                        type="tel" 
                                                        placeholder="Enter your phone number" 
                                                        className="col-span-3" 
                                                        disabled={isLoading}
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="col-span-1">Subject<span className="text-red-500">*</span></Label>
                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem className="col-span-3">
                                                <FormControl className="col-span-3">
                                                    <Input 
                                                        placeholder="Enter a subject" 
                                                        className="col-span-3" 
                                                        disabled={isLoading}
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    <Label className="col-span-1">Message<span className="text-red-500">*</span></Label>
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem className="col-span-3">
                                                <FormControl className="col-span-3">
                                                    <Textarea 
                                                        placeholder="Enter your message" 
                                                        className="col-span-3 resize-none min-h-[100px]" 
                                                        disabled={isLoading}
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    className="bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </section>
        </div>
    );
};
