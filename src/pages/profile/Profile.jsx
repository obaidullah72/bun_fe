import { useState } from "react";
import toast from "react-hot-toast";
import { Save, KeyRound, Lock } from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";
import { updateProfileApi, changePasswordApi } from "../../api/auth.api.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Button from "../../components/ui/Button.jsx";
import { cardClass } from "../../components/ui/uiClasses.js";

function Profile() {
  const user = useAuthStore(function (s) { return s.user; });
  const [profile, setProfile] = useState({ name: user?.name || "", phone: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });

  async function saveProfile(e) {
    e.preventDefault();
    try {
      const res = await updateProfileApi(profile);
      useAuthStore.getState().setAuth({ user: { ...user, ...res.data.data }, accessToken: useAuthStore.getState().accessToken });
      toast.success("Profile updated");
    } catch { toast.error("Update failed"); }
  }

  async function savePassword(e) {
    e.preventDefault();
    try {
      await changePasswordApi(passwords);
      toast.success("Password changed");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch { toast.error("Password change failed"); }
  }

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Update your account information and password" />
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={saveProfile} className={`${cardClass} space-y-4 p-6`}>
          <h2 className="flex items-center gap-2 font-semibold text-slate-900"><Save size={18} className="text-blue-600" /> Profile</h2>
          <FormField label="Full name" name="name" value={profile.name} onChange={function (e) { setProfile({ ...profile, name: e.target.value }); }} required />
          <FormField label="Phone" name="phone" value={profile.phone} onChange={function (e) { setProfile({ ...profile, phone: e.target.value }); }} placeholder="Phone number" />
          <Button type="submit" icon={Save}>Save Profile</Button>
        </form>
        <form onSubmit={savePassword} className={`${cardClass} space-y-4 p-6`}>
          <h2 className="flex items-center gap-2 font-semibold text-slate-900"><KeyRound size={18} className="text-blue-600" /> Change Password</h2>
          <FormField label="Current password" name="password" type="password" value={passwords.currentPassword} onChange={function (e) { setPasswords({ ...passwords, currentPassword: e.target.value }); }} required />
          <FormField label="New password" name="newPassword" type="password" icon={Lock} value={passwords.newPassword} onChange={function (e) { setPasswords({ ...passwords, newPassword: e.target.value }); }} required />
          <Button type="submit" icon={KeyRound}>Change Password</Button>
        </form>
      </div>
    </div>
  );
}
export default Profile;
