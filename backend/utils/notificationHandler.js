const Prescription = require('../models/Prescription');
const Notification = require('../models/Notification');

const checkAndCreateNotifications = async () => {
  try {
    const currentTime = new Date();
    const timeNow = currentTime.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activePrescriptions = await Prescription.find({ 
      completed: false 
    }).populate('patientId');

    console.log(`Checking notifications at ${timeNow}`);

    for (const prescription of activePrescriptions) {
      for (const medicine of prescription.medicines) {
        const times = medicine.timeToTake.split(',').map(t => t.trim());
        
        if (times.includes(timeNow)) {
          const existingNotification = await Notification.findOne({
            userId: prescription.patientId._id,
            'data.prescriptionId': prescription._id,
            'data.drugName': medicine.drugName,
            scheduledTime: timeNow,
            createdAt: { $gte: today }
          });

          if (!existingNotification) {
            await Notification.create({
              userId: prescription.patientId._id,
              message: `Time to take ${medicine.drugName} (${medicine.dosage}) - ${medicine.whenToTake}`,
              type: 'reminder',
              scheduledTime: timeNow,
              data: {
                prescriptionId: prescription._id,
                drugName: medicine.drugName,
                dosage: medicine.dosage,
                whenToTake: medicine.whenToTake
              }
            });
            console.log(`Created notification for ${medicine.drugName}`);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error in notification scheduler:', err);
  }
};

module.exports = { checkAndCreateNotifications };
