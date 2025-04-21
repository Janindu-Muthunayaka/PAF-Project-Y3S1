import React, { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi'; // ✅ FiEdit2 imported
import { getSkills, addSkill, deleteSkill, updateSkill } from '../../services/ish/skillService';

const SkillsSection = ({ userId: propUserId, isCurrentUser }) => {
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ skillName: '', description: '' });
  const [editingSkill, setEditingSkill] = useState(null);
  const userId = propUserId || sessionStorage.getItem("sessionId"); // ✅ fallback to session if not passed

  const fetchSkills = async () => {
    try {
      const data = await getSkills(userId);
      setSkills(data);
    } catch (err) {
      console.error("Failed to fetch skills", err);
    }
  };

  const handleAddOrEditSkill = async () => {
    if (!newSkill.skillName.trim()) return;

    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, { ...newSkill, userId }); // ✅ use id not skillId
      } else {
        await addSkill({ ...newSkill, userId });
      }

      setNewSkill({ skillName: '', description: '' });
      setEditingSkill(null);
      setShowModal(false);
      fetchSkills();
    } catch (err) {
      console.error("Failed to submit skill", err);
    }
  };

  const handleEditClick = (skill) => {
    setEditingSkill(skill);
    setNewSkill({ skillName: skill.skillName, description: skill.description });
    setShowModal(true);
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await deleteSkill(skillId); // ✅ skillId passed correctly
      fetchSkills();
    } catch (err) {
      console.error("Failed to delete skill", err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [userId]);

  return (
    <div className="card p-6 bg-[var(--dark-surface)] rounded-xl border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Skills</h3>
        {isCurrentUser && (
          <button
            onClick={() => {
              setNewSkill({ skillName: '', description: '' });
              setEditingSkill(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiPlus />
            Add Skill
          </button>
        )}
      </div>

      {skills.length === 0 ? (
        <p className="text-gray-400 italic">
          {isCurrentUser ? "You haven't added any skills yet." : "No skills to display."}
        </p>
      ) : (
        <ul className="space-y-3">
          {skills.map((skill) => (
            <li key={skill.id} className="flex justify-between items-start bg-gray-800 p-4 rounded-lg border border-gray-600">
              <div>
                <h4 className="text-white font-medium">{skill.skillName}</h4>
                <p className="text-gray-400 text-sm">{skill.description}</p>
              </div>
              {isCurrentUser && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(skill)}
                    className="text-yellow-400 hover:text-yellow-300"
                    title="Edit skill"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDeleteSkill(skill.id)} // ✅ use id
                    className="text-red-500 hover:text-red-400"
                    title="Delete skill"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4 text-center">
              {editingSkill ? 'Edit Skill' : 'Add Skill'}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Skill Name"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
                value={newSkill.skillName}
                onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
                value={newSkill.description}
                onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingSkill(null);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEditSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                {editingSkill ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
