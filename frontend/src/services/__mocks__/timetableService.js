export const timetableService = {
    getAllTimetables: jest.fn(),
    getTimetable: jest.fn(),
    createTimetable: jest.fn(),
    updateTimetable: jest.fn(),
    updateSlot: jest.fn(),
    getStudentPersonalTimetable: jest.fn(() => Promise.resolve({
        success: true,
        timetable: {
            department: 'CSE',
            semester: 'Odd',
            program: 'B.Tech',
            section: 'A',
            classAdvisors: [],
            timetableSlots: [],
            courses: []
        }
    })),
    deleteTimetable: jest.fn()
};
