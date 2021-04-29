namespace Terrasoft.Configuration.IteLessonDurationService
{
	using System;
	using System.ServiceModel;
	using System.ServiceModel.Web;
	using System.ServiceModel.Activation;
	using Terrasoft.Core;
	using Terrasoft.Web.Common;
	using Terrasoft.Core.Entities;

	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class IteLessonDurationService: BaseService
	{
		[OperationContract]
		[WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
		ResponseFormat = WebMessageFormat.Json)]
		public int GetDuration(Guid programId)
		{
			if (programId == Guid.Empty)
			{
				return -1;
			}
			
			int overallDuration = 0;
			var esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "IteSwimmingLesson");
			var lessonDurationCol = esq.AddColumn("IteDuration");
			var esqFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "IteProgram.Id", programId);
			esq.Filters.Add(esqFilter);
			var entities = esq.GetEntityCollection(UserConnection);
			
			foreach (var entity in entities)
			{
				overallDuration += entity.GetTypedColumnValue<int>(lessonDurationCol.Name);
			}

			return entities.Count != 0 ? overallDuration : -1;
		}
	}
}