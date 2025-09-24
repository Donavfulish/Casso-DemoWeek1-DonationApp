
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BankSelectionModal({ isOpen, onClose, services, onSelectService }) {
    const [currentStep, setCurrentStep] = useState("banks"); // "banks" | "services"
    const [selectedBank, setSelectedBank] = useState(null);
    const modalRef = useRef(null);
    const firstFocusableRef = useRef(null);

    const banksData = useMemo(() => {
        const map = {};
        (services?.fiServices || []).forEach(element => {
            if (!map[element.fiName]) {
                map[element.fiName] = { ...element, services: [] };
            }
            map[element.fiName].services.push(element);
        });
        return Object.values(map);
    }, [services]);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setCurrentStep("banks");
            setSelectedBank(null);
        }
    }, [isOpen]);

    // Focus trap and keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }

            if (e.key === "Tab") {
                const modal = modalRef.current;
                if (!modal) return;

                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        // Focus first element when modal opens
        setTimeout(() => {
            firstFocusableRef.current?.focus();
        }, 100);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleBankSelect = (bank) => {
        setSelectedBank(bank);
        setCurrentStep("services");
    };

    const handleServiceSelect = (service) => {
        onSelectService(service);
        onClose();
    };

    const handleBack = () => {
        setCurrentStep("banks");
        setSelectedBank(null);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className={cn(
                    "relative w-full max-w-4xl max-h-[90vh] mx-4 bg-background bg-white rounded-xl shadow-2xl",
                    "transform transition-all duration-300 ease-out",
                    currentStep === "banks" ? "animate-in fade-in-0 zoom-in-95" : "animate-in slide-in-from-left-5"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        {currentStep === "services" && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBack}
                                className="p-2 hover:bg-accent"
                                aria-label="Go back to bank selection"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        <h2 className="text-xl font-semibold text-foreground">
                            {currentStep === "banks" ? "Select Your Bank" : `${selectedBank?.name} Services`}
                        </h2>
                    </div>
                    <Button
                        ref={firstFocusableRef}
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="p-2 hover:bg-accent"
                        aria-label="Close modal"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {currentStep === "banks" && (
                        <div className="space-y-4">
                            {services.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground text-lg">No banks available</p>
                                    <p className="text-muted-foreground text-sm mt-2">Please check back later or contact support.</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-muted-foreground mb-6">Choose your bank to view available payment services</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {banksData.map((bank) => (
                                            <Card
                                                key={bank.fiName}
                                                className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer border-border hover:border-primary/20"
                                            >
                                                <div className="p-6 space-y-4">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                                            {bank.logo ? (
                                                                <img
                                                                    src={bank.logo || "/placeholder.svg"}
                                                                    alt={`${bank.name} logo`}
                                                                    className="w-full h-full object-contain"
                                                                    onError={(e) => {
                                                                        e.target.style.display = "none";
                                                                        e.target.nextElementSibling?.classList.remove("hidden");
                                                                    }}
                                                                />
                                                            ) : null}
                                                            <div
                                                                className={cn(
                                                                    "text-xs font-medium text-muted-foreground text-center",
                                                                    bank.logo && "hidden"
                                                                )}
                                                            >
                                                                {bank.name
                                                                    .split(" ")
                                                                    .map((word) => word[0])
                                                                    .join("")
                                                                    .slice(0, 3)}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-medium text-foreground truncate">{bank.name}</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                {bank.services.length} service{bank.services.length !== 1 ? "s" : ""} available
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={() => handleBankSelect(bank)}
                                                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                                        variant="outline"
                                                    >
                                                        Select
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {currentStep === "services" && selectedBank && (
                        <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
                            {selectedBank.services.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground text-lg">No services available</p>
                                    <p className="text-muted-foreground text-sm mt-2">
                                        This bank doesn't have any payment services configured.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-muted-foreground mb-6">Select a payment service from {selectedBank.name}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selectedBank.services.map((service) => (
                                            <Card
                                                key={service.id}
                                                className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer border-border hover:border-primary/20"
                                            >
                                                <div className="p-6 space-y-4">
                                                    <div className="flex items-center space-x-3">
                                                        {service.logo ? (
                                                            <img
                                                                src={service.logo || "/placeholder.svg"}
                                                                alt={`${service.name} logo`}
                                                                className="w-1/6 h-1/6 object-contain"
                                                                onError={(e) => {
                                                                    e.target.style.display = "none";
                                                                    e.target.nextElementSibling?.classList.remove("hidden");
                                                                }}
                                                            />
                                                        ) : null}

                                                        <div className="flex-1">
                                                            <h3 className="font-medium text-foreground">{service.name}</h3>
                                                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                                                {service.type}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        onClick={() => handleServiceSelect(service)}
                                                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                                        variant="outline"
                                                    >
                                                        Choose
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
