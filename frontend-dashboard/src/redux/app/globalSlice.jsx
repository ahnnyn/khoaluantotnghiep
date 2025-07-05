import { createSlice } from '@reduxjs/toolkit';

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    reloadMedicalData: 0,
    reloadDoctorProfile: 0,
    reloadWorkSchedule: 0,
  },
  reducers: {
    triggerReloadMedicalData: (state) => {
      state.reloadMedicalData += 1;
    },
    triggerReloadDoctorProfile: (state) => {
      state.reloadDoctorProfile += 1;
    },
    triggerReloadWorkSchedule: (state) => {
      state.reloadWorkSchedule += 1;
    },
  },
});

export const {
  triggerReloadMedicalData,
  triggerReloadDoctorProfile,
  triggerReloadWorkSchedule,
} = globalSlice.actions;

export default globalSlice.reducer;
