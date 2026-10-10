import PeopleManager from "@/components/modules/PeopleManager";

export default function TeachersPage() {
  return (
    <PeopleManager
      title="Teachers"
      description="Manage teaching staff and assigned subjects."
      endpoint="/api/teachers"
      extraField={{ name: "subject", label: "Subject" }}
    />
  );
}
