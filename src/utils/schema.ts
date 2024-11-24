import {z} from 'zod'

export const eventSchema = z.object({
    title: z.string().nonempty("Event title is required"),
    description: z.string().nonempty("Description is required"),
    registrationStartDate: z.string().nonempty("Registration start date is required"),
    registrationEndDate: z.string().nonempty("Registration end date is required"),
    eventStartDate: z.string().nonempty("Event start date is required"),
    eventEndDate: z.string().nonempty("Event end date is required"),
    allowedSportLimit: z
    .number({ invalid_type_error: "Allowed Sport Limit must be a number" })
    .min(1, "Allowed Sport Limit must be at least 1"),
    image: z.string().optional(),
});

export const sportSchema = z.object({
    title: z.string().nonempty('Sport title is required'),
    minPlayer: z
    .number({invalid_type_error: 'Min Player must be a number'})
    .min(1, 'Min Player must be at least 1'),
    maxPlayer: z
    .number({invalid_type_error: 'Max Player must be a number'})
    .min(1, 'Max Player must be at least 1'),
    minMen: z
    .number({invalid_type_error: 'Min Men must be a number'})
    .min(1, 'Min Men must be at least 1'),
    minWomen: z
    .number({invalid_type_error: 'Min Women must be a number'})
    .min(0, 'Min Women must be at least 1'),
    description: z.string().nonempty("Description is required"),
})

export const teamSchema = z.object({
    name: z.string().nonempty('Team name is required')
})

export const matchSchema = z.object({
    sportId: z.string().nonempty('Sport is required'),
    week: z.number({invalid_type_error: "Week must be a number"}).min(1, "Week must be at least 1"),
    teamRedId: z.string().nonempty("Team Red is required"),
    teamBlueId: z.string().nonempty("Team Blue is required"),
    venue: z.string().nonempty("Venue is required"),
    startTime: z.string().nonempty("Start time is required"),
    endTime: z.string().nonempty("End time is required")
        }).superRefine((data, ctx) => {
        if (new Date(data.endTime) <= new Date(data.startTime)) {
            ctx.addIssue({
                code: "custom",
            path: ['endTime'], 
            message: "End time must be greater than start time",
            });
        }
}) 

export const extraPointSchema = z.object({
    week: z.number({invalid_type_error: "Week must be number"}).min(1, "Week must be at least 1"),
    point: z.string().nonempty("Point is required"),
    description: z.string().nonempty("Description is required")
})

export const scheduleSchema = z.object({
    week: z.number({invalid_type_error: "Week must be number"}).min(1, "Week must be at least 1"),
    startAttendance: z.string().nonempty("Start Attendance is required"),
    endAttendance: z.string().nonempty("End Attendance is required")
    }).superRefine((data, ctx) => {
    if (new Date(data.endAttendance) <= new Date(data.startAttendance)) {
        ctx.addIssue({
            code: "custom",
        path: ['endAttendance'], 
        message: "End attendance must be greater than start attendance",
        });
    }
})