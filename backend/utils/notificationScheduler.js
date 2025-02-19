const Prescription = require('../models/Prescription');
const Notification = require('../models/Notification');

const checkAndCreateNotifications = async () => {
  try {
    // Get current time in HH:mm format
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log(`Checking notifications at ${currentTime}`);

    // Get active prescriptions
    const activePrescriptions = await Prescription.find({ 
      completed: false 
    }).populate('patientId');

    for (const prescription of activePrescriptions) {
      // Check if medicines array exists and has items
      if (!prescription.medicines || !Array.isArray(prescription.medicines)) {
        console.log(`Skipping prescription ${prescription._id} - no medicines array`);
        continue;
      }

      // Process each medicine in the prescription
      for (const medicine of prescription.medicines) {
        // Validate medicine object
        if (!medicine || !medicine.timeToTake) {
          console.log(`Skipping medicine in prescription ${prescription._id} - invalid medicine data`);
          continue;
        }

        const times = medicine.timeToTake.split(',').map(t => t.trim());
        console.log(`Checking medicine ${medicine.drugName} scheduled for times:`, times);
        
        if (times.includes(currentTime)) {
          console.log(`Time match found for ${medicine.drugName} at ${currentTime}`);

          // Check for existing notification
          const existingNotification = await Notification.findOne({
            userId: prescription.patientId._id,
            'data.prescriptionId': prescription._id,
            'data.drugName': medicine.drugName,
            scheduledTime: currentTime,
            createdAt: { $gte: today }
          });

          if (!existingNotification) {
            console.log(`Creating notification for ${medicine.drugName}`);
            
            await Notification.create({
              userId: prescription.patientId._id,
              message: `Time to take ${medicine.drugName} (${medicine.dosage}) - ${medicine.whenToTake}`,
              type: 'reminder',
              scheduledTime: currentTime,
              data: {
                prescriptionId: prescription._id,
                drugName: medicine.drugName,
                dosage: medicine.dosage,
                whenToTake: medicine.whenToTake
              }
            });

            console.log(`Notification created for ${medicine.drugName}`);
          } else {
            console.log(`Notification already exists for ${medicine.drugName} at ${currentTime}`);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error in notification scheduler:', err);
    console.error('Error details:', err.stack);
  }
};

module.exports = { checkAndCreateNotifications };
