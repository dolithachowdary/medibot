export const UserDetails = (parent, onComplete) => {
    const render = () => {
        parent.innerHTML = `
      <div class="form-container fade-in">
        <div class="form-header">
          <div class="progress-bar"><div class="progress-fill" style="width: 100%;"></div></div>
          <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 0.5rem;">Create Profile</h2>
          <p style="color: var(--text-muted);">Let's personalize your health experience.</p>
        </div>
        
        <div class="input-group">
          <label>Full Name</label>
          <input type="text" id="name" placeholder="John Doe">
        </div>
        
        <div style="display: flex; gap: 1rem;">
          <div class="input-group" style="flex: 1;">
            <label>Age</label>
            <input type="number" id="age" placeholder="25">
          </div>
          <div class="input-group" style="flex: 1;">
            <label>Gender</label>
            <select id="gender">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div style="display: flex; gap: 1rem;">
          <div class="input-group" style="flex: 1;">
            <label>Height (cm)</label>
            <input type="number" id="height" placeholder="175">
          </div>
          <div class="input-group" style="flex: 1;">
            <label>Weight (kg)</label>
            <input type="number" id="weight" placeholder="70">
          </div>
        </div>
        
        <div class="input-group">
          <label>Existing Conditions</label>
          <textarea id="conditions" placeholder="e.g. Diabetes, Hypertension (comma separated)"></textarea>
        </div>
        
        <button class="btn-next" id="complete-btn" style="border-radius: 50px; padding: 1.1rem; background: var(--primary); box-shadow: 0 10px 20px rgba(0, 82, 204, 0.2);">
          Complete Setup
        </button>
        <div style="height: 50px;"></div>
      </div>
    `;

        document.getElementById('complete-btn').addEventListener('click', () => {
            const userData = {
                name: document.getElementById('name').value,
                age: document.getElementById('age').value,
                gender: document.getElementById('gender').value,
                height: document.getElementById('height').value,
                weight: document.getElementById('weight').value,
                conditions: document.getElementById('conditions').value.split(',').map(s => s.trim())
            };
            onComplete(userData);
        });
    };

    render();
};
