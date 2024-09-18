export interface Event {
    id: string;
    title: string;
    description: string;
    image: string;
    registrationStartDate: string;
    registrationEndDate: string;
    eventStartDate: string;
    eventEndDate: string;
    officialId: string;
    allowedSportLimit: number;
    status: string;
    isActive: boolean;
}