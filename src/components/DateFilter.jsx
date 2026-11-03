import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const DateFilter = ({ selectedPeriod, onPeriodChange }) => {
  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel id="period-label">Created within</InputLabel>

      <Select
        labelId="period-label"
        value={selectedPeriod}
        label="Created within"
        onChange={event => onPeriodChange(event.target.value)}
      >
        <MenuItem value={7}>Last 1 week</MenuItem>
        <MenuItem value={14}>Last 2 weeks</MenuItem>
        <MenuItem value={30}>Last 1 month</MenuItem>
      </Select>
    </FormControl>
  )
}

export default DateFilter