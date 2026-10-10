import PeopleManager from "@/components/modules/PeopleManager";

export default function ParentsPage() {
  return (
    <PeopleManager
      title="Parents"
      description="Parent contacts stored in MongoDB."
      endpoint="/api/parents"
      extraField={{ name: "phone", label: "Phone" }}
    />
  );
}
